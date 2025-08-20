import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GithubRepositoryDto } from './github-repository.dto';

export class ObjectNodeDto {
  @IsString()
  @IsOptional()
  text?: string | null;
}

export class WatchersDto {
  @IsInt()
  totalCount!: number;
}

export class OwnerDto {
  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsUrl()
  avatarUrl!: string;

  @IsUrl()
  url!: string;
}

export class RepositoryDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @ValidateNested()
  @Type(() => OwnerDto)
  owner!: OwnerDto;

  @IsUrl()
  url!: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsInt()
  forkCount!: number;

  @IsInt()
  stargazerCount!: number;

  @ValidateNested()
  @Type(() => WatchersDto)
  watchers!: WatchersDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => ObjectNodeDto)
  object?: ObjectNodeDto | null;
}

export class RepositoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepositoryDto)
  nodes!: RepositoryDto[];
}

export class OrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ValidateNested()
  @Type(() => RepositoriesDto)
  repositories!: RepositoriesDto;

  @IsBoolean()
  viewerCanAdminister!: boolean;
}

export class OrganizationsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrganizationDto)
  nodes!: OrganizationDto[];
}

export class ViewerDto {
  @ValidateNested()
  @Type(() => RepositoriesDto)
  repositories!: RepositoriesDto;

  @ValidateNested()
  @Type(() => OrganizationsDto)
  organizations!: OrganizationsDto;
}

export class GithubRepositorySuggestionGraphqlResponse {
  @ValidateNested()
  @Type(() => ViewerDto)
  viewer!: ViewerDto;
}

export function adaptGraphqlRepo(repo: RepositoryDto): GithubRepositoryDto {
  return {
    id: 0,
    node_id: repo.id,
    name: repo.name,
    full_name: `${repo.owner.login}/${repo.name}`, // GraphQL doesn't have full_name directly
    owner: {
      id: 0, // Placeholder, as GraphQL id is string and REST id is number
      login: repo.owner.login,
      node_id: repo.owner.id,
      avatar_url: repo.owner.avatarUrl,
      html_url: repo.owner.url,
    },
    html_url: repo.url,
    description: repo.description ?? '',
    forks_count: repo.forkCount,
    watchers_count: repo.watchers.totalCount,
    stargazers_count: repo.stargazerCount,
    readme: repo.object?.text || undefined,
  };
}

export function adaptGraphqlResponse(
  graphqlResponse: GithubRepositorySuggestionGraphqlResponse,
): GithubRepositoryDto[] {
  const viewerRepos =
    graphqlResponse.viewer.repositories.nodes.map(adaptGraphqlRepo);

  const orgRepos = graphqlResponse.viewer.organizations.nodes
    .filter((org) => org.viewerCanAdminister)
    .flatMap((org) => org.repositories.nodes.map(adaptGraphqlRepo));

  return [...viewerRepos, ...orgRepos];
}
