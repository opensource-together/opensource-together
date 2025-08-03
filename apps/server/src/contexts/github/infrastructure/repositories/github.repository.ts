import {
  GithubRepositoryPort,
  RepositoryInfo,
} from '@/contexts/github/use-cases/ports/github-repository.port';
import { ContributionGraph } from '@/contexts/user/domain/github-stats.vo';
import { Result } from '@/libs/result';
import { Injectable, Logger } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { toGithubInvitationDto } from './adapters/github-invitation.adapter';
import { toGithubRepoListInput } from './adapters/github-repo-list.adapter';
import { toGithubRepositoryDto } from './adapters/github-repository.adapter';
import { GithubInvitationDto } from './dto/github-invitation.dto';
import { GithubRepositoryPermissionsDto } from './dto/github-permissions.dto';
import { GithubRepositoryDto } from './dto/github-repository.dto';
import { GithubRepoListInput } from './inputs/github-repo-list.input';
import { InviteUserToRepoInput } from './inputs/invite-user-to-repo.inputs.dto';

@Injectable()
export class GithubRepository implements GithubRepositoryPort {
  private readonly Logger = new Logger(GithubRepository.name);
  constructor() {}

  async createGithubRepository(
    input: {
      title: string;
      description: string;
    },
    octokit: Octokit,
  ): Promise<Result<GithubRepositoryDto>> {
    try {
      const response = await octokit.rest.repos.createForAuthenticatedUser({
        name: input.title,
        description: input.description,
        private: false,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return toGithubRepositoryDto(response);
    } catch (e) {
      this.Logger.error('error creating github repository', e);
      return Result.fail('Failed to create github repository');
    }
  }

  async inviteUserToRepository(
    input: InviteUserToRepoInput,
    octokit: Octokit,
  ): Promise<Result<GithubInvitationDto>> {
    try {
      const response = await octokit.rest.repos.addCollaborator({
        owner: input.owner,
        repo: input.repo,
        username: input.username,
        permission: GithubRepositoryPermissionsDto[input.permission],
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      return toGithubInvitationDto(response);
    } catch (e) {
      this.Logger.log('error inviting user to repository', e);
      return Result.fail('Failed to invite user to repository');
    }
  }

  async findRepositoryByOwnerAndName(
    owner: string,
    name: string,
    octokit: Octokit,
  ): Promise<Result<RepositoryInfo, string>> {
    try {
      const response = await octokit.rest.repos.get({
        owner,
        repo: name,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      const repositoryInfo = {
        forks: response.data.forks_count,
        stars: response.data.stargazers_count,
        watchers: response.data.watchers_count,
        openIssues: response.data.open_issues_count,
      };
      this.Logger.log('repositoryInfo', repositoryInfo);
      return Result.ok<RepositoryInfo>(repositoryInfo);
    } catch (e) {
      this.Logger.error('error fetching repository', e);
      return Result.fail('Failed to fetch repository');
    }
  }

  async findCommitsByRepository(
    owner: string,
    repo: string,
    octokit: Octokit,
  ): Promise<
    Result<
      {
        lastCommit: {
          sha: string;
          message: string;
          date: string;
          url: string;
          author: {
            login: string;
            avatar_url: string;
            html_url: string;
          };
        } | null;
        commitsNumber: number;
      },
      string
    >
  > {
    try {
      const response = await octokit.rest.repos.listCommits({
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      const rawCommit = response.data[0];
      const lastCommit = {
        sha: rawCommit.sha,
        message: rawCommit.commit.message,
        date: rawCommit.commit.author?.date as string,
        url: rawCommit.html_url,
        author: {
          login: rawCommit.author?.login as string,
          avatar_url: rawCommit.author?.avatar_url as string,
          html_url: rawCommit.author?.html_url as string,
        },
      };
      const commitsNumber = response.data.length;

      return Result.ok({
        lastCommit,
        commitsNumber,
      });
    } catch (e: any) {
      this.Logger.error('error fetching commits', e);
      // if (e.status === 409 && e.message.includes('Git Repository is empty')) {
      // }
      return Result.ok({
        lastCommit: {
          sha: '',
          message: '',
          date: '',
          url: '',
          author: {
            login: '',
            avatar_url: '',
            html_url: '',
          },
        },
        commitsNumber: 0,
      });
      // return Result.fail('Failed to fetch commits');
    }
  }

  async findContributorsByRepository(
    owner: string,
    repo: string,
    octokit: Octokit,
  ): Promise<
    Result<
      Array<{
        login: string;
        avatar_url: string;
        html_url: string;
        contributions: number;
      }>,
      string
    >
  > {
    try {
      const response = await octokit.rest.repos.listContributors({
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (!Array.isArray(response.data)) {
        this.Logger.error(
          'Unexpected response format for contributors',
          response.data,
        );
        return Result.ok([]);
      }

      const contributors = response.data.map((contributor) => ({
        login: contributor.login as string,
        avatar_url: contributor.avatar_url as string,
        html_url: contributor.html_url as string,
        contributions: contributor.contributions,
      }));
      return Result.ok(contributors);
    } catch (e: any) {
      this.Logger.error('error fetching contributors', e);
      // if (e.status === 409 && e.message.includes('Git Repository is empty')) {
      // }
      return Result.ok([]);
      // return Result.fail('Failed to fetch contributors');
    }
  }

  async findRepositoriesOfAuthenticatedUser(
    octokit: Octokit,
  ): Promise<Result<GithubRepoListInput[], string>> {
    try {
      const response = await octokit.rest.repos.listForAuthenticatedUser({
        visibility: 'public',
        per_page: 50,
        affiliation: 'owner,organization_member',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      this.Logger.log(
        `Found ${response.data.length} matching repositories.`,
      );

      const repositories = response.data
        .map((repo) => {
          const rep = toGithubRepositoryDto(repo);
          if (rep.success) {
            return rep.value;
          } else {
            this.Logger.error(
              'Failed to transform repository to DTO:',
              rep.error,
            );
            return undefined;
          }
        })
        .filter((v) => v !== undefined)
        .map((repo) => {
          const rep = toGithubRepoListInput(repo);
          if (rep.success) {
            return rep.value;
          } else {
            this.Logger.error(
              'Failed to transform repository to list input:',
              rep.error,
            );
            return undefined;
          }
        })
        .filter((v) => v !== undefined);

      // Récupérer les README pour chaque repository
      const repositoriesWithReadme = await Promise.all(
        repositories.map(async (repo) => {
          try {
            const readmeResult = await this.getRepositoryReadme(
              repo.owner,
              repo.title,
              octokit,
            );
            if (readmeResult.success) {
              return { ...repo, readme: readmeResult.value };
            } else {
              this.Logger.warn(
                `Failed to fetch README for ${repo.owner}/${repo.title}: ${readmeResult.error}`,
              );
              return repo;
            }
          } catch (error) {
            this.Logger.error(
              `Error fetching README for ${repo.owner}/${repo.title}:`,
              error,
            );
            return repo;
          }
        }),
      );

      return Result.ok(repositoriesWithReadme);
    } catch (e) {
      this.Logger.error('error fetching user repositories', e);
      return Result.fail('Failed to fetch user repositories');
    }
  }

  async getRepositoryReadme(
    owner: string,
    repo: string,
    octokit: Octokit,
  ): Promise<Result<string, string>> {
    try {
      const response = await octokit.rest.repos.getReadme({
        owner,
        repo,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });

      // Le contenu est encodé en base64
      const content = Buffer.from(response.data.content, 'base64').toString(
        'utf-8',
      );
      return Result.ok(content);
    } catch (e: any) {
      if (e) {
        return Result.fail('README not found');
      }
      this.Logger.error('error fetching repository README', e);
      return Result.fail('Failed to fetch repository README');
    }
  }

  async getUserTotalStars(octokit: Octokit): Promise<Result<number, string>> {
    try {
      this.Logger.log('Fetching user total stars using GraphQL');

      // Récupérer l'utilisateur authentifié
      const userResponse = await octokit.rest.users.getAuthenticated();
      const username = userResponse.data.login;

      // Utiliser GraphQL pour récupérer les stars de tous les types de repositories
      const graphqlQuery = `
        query($username: String!) {
          user(login: $username) {
            # Repositories owned par l'utilisateur
            repositories(first: 100, privacy: PUBLIC, isFork: false, ownerAffiliations: OWNER) {
              nodes {
                stargazerCount
                nameWithOwner
              }
            }
            # Repositories où l'utilisateur a contribué (pas owner)
            repositoriesContributedTo(first: 100, privacy: PUBLIC) {
              nodes {
                stargazerCount
                nameWithOwner
              }
            }
            # Organisations dont l'utilisateur est membre
            organizations(first: 100) {
              nodes {
                repositories(first: 100, privacy: PUBLIC) {
                  nodes {
                    stargazerCount
                    nameWithOwner
                  }
                }
              }
            }
          }
        }
      `;

      const response: {
        user?: {
          repositories?: {
            nodes?: Array<{
              stargazerCount: number;
              nameWithOwner: string;
            }>;
          };
          repositoriesContributedTo?: {
            nodes?: Array<{
              stargazerCount: number;
              nameWithOwner: string;
            }>;
          };
          organizations?: {
            nodes?: Array<{
              repositories?: {
                nodes?: Array<{
                  stargazerCount: number;
                  nameWithOwner: string;
                }>;
              };
            }>;
          };
        };
      } = await octokit.graphql(graphqlQuery, {
        username,
      });

      let totalStars = 0;
      const countedRepos = new Set<string>(); // Pour éviter les doublons

      // Stars des repositories owned
      if (response.user?.repositories?.nodes) {
        for (const repo of response.user.repositories.nodes) {
          if (!countedRepos.has(repo.nameWithOwner)) {
            totalStars += repo.stargazerCount || 0;
            countedRepos.add(repo.nameWithOwner);
          }
        }
      }

      // Stars des repositories contribués (pas owner)
      if (response.user?.repositoriesContributedTo?.nodes) {
        for (const repo of response.user.repositoriesContributedTo.nodes) {
          if (!countedRepos.has(repo.nameWithOwner)) {
            totalStars += repo.stargazerCount || 0;
            countedRepos.add(repo.nameWithOwner);
          }
        }
      }

      // Stars des repositories d'organisations
      if (response.user?.organizations?.nodes) {
        for (const org of response.user.organizations.nodes) {
          if (org.repositories?.nodes) {
            for (const repo of org.repositories.nodes) {
              if (!countedRepos.has(repo.nameWithOwner)) {
                totalStars += repo.stargazerCount || 0;
                countedRepos.add(repo.nameWithOwner);
              }
            }
          }
        }
      }

      this.Logger.log(
        `Total stars calculated (GraphQL): ${totalStars} for ${username} (${countedRepos.size} unique repos)`,
      );
      return Result.ok(totalStars);
    } catch (error) {
      this.Logger.error('Error fetching user total stars with GraphQL', error);
      return Result.fail('Failed to fetch user total stars with GraphQL');
    }
  }

  async getUserContributedRepos(
    octokit: Octokit,
  ): Promise<Result<number, string>> {
    try {
      this.Logger.log(
        'Fetching user contributed repositories count using GraphQL',
      );

      // Récupérer l'utilisateur authentifié
      const userResponse = await octokit.rest.users.getAuthenticated();
      const username = userResponse.data.login;

      // Utiliser GraphQL pour récupérer tous les types de repositories en une seule requête
      const graphqlQuery = `
        query($username: String!) {
          user(login: $username) {
            repositories(first: 100, privacy: PUBLIC, ownerAffiliations: OWNER) {
              totalCount
            }
            repositoriesContributedTo(first: 100, privacy: PUBLIC) {
              totalCount
            }
            organizations(first: 100) {
              totalCount
              nodes {
                repositories(first: 100, privacy: PUBLIC) {
                  totalCount
                }
              }
            }
          }
        }
      `;

      const response: {
        user?: {
          repositories?: {
            totalCount: number;
          };
          repositoriesContributedTo?: {
            totalCount: number;
          };
          organizations?: {
            nodes?: Array<{
              repositories?: {
                totalCount: number;
              };
            }>;
          };
        };
      } = await octokit.graphql(graphqlQuery, {
        username,
      });

      let totalRepos = 0;

      // Repositories owned
      const ownedRepos = response.user?.repositories?.totalCount || 0;
      totalRepos += ownedRepos;
      this.Logger.log(`Owned repositories: ${ownedRepos}`);

      // Repositories contribués (individuels)
      const contributedRepos =
        response.user?.repositoriesContributedTo?.totalCount || 0;
      totalRepos += contributedRepos;
      this.Logger.log(
        `Contributed repositories (individual): ${contributedRepos}`,
      );

      // Repositories d'organisations
      let orgRepos = 0;
      if (response.user?.organizations?.nodes) {
        for (const org of response.user.organizations.nodes) {
          orgRepos += org.repositories?.totalCount || 0;
        }
      }
      totalRepos += orgRepos;
      this.Logger.log(`Organization repositories: ${orgRepos}`);

      this.Logger.log(
        `Total repositories where user figures (GraphQL): ${totalRepos}`,
      );
      return Result.ok(totalRepos);
    } catch (error) {
      this.Logger.error(
        'Error fetching user contributed repos count with GraphQL',
        error,
      );
      return Result.fail(
        'Failed to fetch user contributed repos count with GraphQL',
      );
    }
  }

  async getUserCommitsLastYear(
    octokit: Octokit,
  ): Promise<Result<number, string>> {
    try {
      this.Logger.log('Fetching user total commits using GraphQL');

      // Récupérer l'utilisateur authentifié
      const userResponse = await octokit.rest.users.getAuthenticated();
      const username = userResponse.data.login;

      // Utiliser l'API GraphQL pour récupérer toutes les contributions de l'année
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01T00:00:00Z`;
      const endDate = `${currentYear}-12-31T23:59:59Z`;

      const graphqlQuery = `
        query($username: String!, $startDate: DateTime!, $endDate: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $startDate, to: $endDate) {
              # Total des contributions par type
              totalCommitContributions
              totalIssueContributions
              totalPullRequestContributions
              totalPullRequestReviewContributions
              
              # Détail des contributions par repository
              commitContributionsByRepository(maxRepositories: 100) {
                repository {
                  nameWithOwner
                }
                contributions {
                  totalCount
                }
              }
              
              # Contributions issues
              issueContributionsByRepository(maxRepositories: 100) {
                repository {
                  nameWithOwner
                }
                contributions {
                  totalCount
                }
              }
              
              # Contributions pull requests
              pullRequestContributionsByRepository(maxRepositories: 100) {
                repository {
                  nameWithOwner
                }
                contributions {
                  totalCount
                }
              }
            }
          }
        }
      `;

      const response: {
        user?: {
          contributionsCollection?: {
            totalCommitContributions: number;
            totalIssueContributions: number;
            totalPullRequestContributions: number;
            totalPullRequestReviewContributions: number;
            commitContributionsByRepository?: Array<{
              contributions?: {
                totalCount: number;
              };
            }>;
          };
        };
      } = await octokit.graphql(graphqlQuery, {
        username,
        startDate,
        endDate,
      });

      let totalContributions = 0;
      const contributionsCollection = response.user?.contributionsCollection;

      if (contributionsCollection) {
        // Commits
        const totalCommits =
          contributionsCollection.totalCommitContributions || 0;
        totalContributions += totalCommits;
        this.Logger.log(`Total commits: ${totalCommits}`);

        // Issues
        const totalIssues =
          contributionsCollection.totalIssueContributions || 0;
        totalContributions += totalIssues;
        this.Logger.log(`Total issues: ${totalIssues}`);

        // Pull Requests
        const totalPRs =
          contributionsCollection.totalPullRequestContributions || 0;
        totalContributions += totalPRs;
        this.Logger.log(`Total pull requests: ${totalPRs}`);

        // Reviews
        const totalReviews =
          contributionsCollection.totalPullRequestReviewContributions || 0;
        totalContributions += totalReviews;
        this.Logger.log(`Total reviews: ${totalReviews}`);

        // Si le total des commits est faible, calculer à partir des contributions par repository
        if (totalCommits < 50) {
          let detailedCommits = 0;
          const commitContributions =
            contributionsCollection.commitContributionsByRepository || [];

          for (const contribution of commitContributions) {
            const count = contribution.contributions?.totalCount || 0;
            detailedCommits += count;
          }

          if (detailedCommits > totalCommits) {
            totalContributions =
              totalContributions - totalCommits + detailedCommits;
            this.Logger.log(
              `Using detailed commits count: ${detailedCommits} (instead of ${totalCommits})`,
            );
          }
        }
      }

      this.Logger.log(
        `Total contributions in ${currentYear} (GraphQL): ${totalContributions}`,
      );
      return Result.ok(totalContributions);
    } catch (error) {
      this.Logger.error('Error fetching user commits with GraphQL', error);
      return Result.fail('Failed to fetch user commits with GraphQL');
    }
  }

  async getUserContributionGraph(
    octokit: Octokit,
  ): Promise<Result<ContributionGraph, string>> {
    try {
      this.Logger.log('Fetching user contribution graph using GraphQL');
      const userResponse = await octokit.rest.users.getAuthenticated();
      const username = userResponse.data.login;
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-01-01T00:00:00Z`;
      const endDate = `${currentYear}-12-31T23:59:59Z`;
      const graphqlQuery = `
        query($username: String!, $startDate: DateTime!, $endDate: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $startDate, to: $endDate) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;
      const response: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions: number;
              weeks: Array<{
                contributionDays: Array<{
                  date: string;
                  contributionCount: number;
                }>;
              }>;
            };
          };
        };
      } = await octokit.graphql(graphqlQuery, {
        username,
        startDate,
        endDate,
      });

      const calendar =
        response.user?.contributionsCollection?.contributionCalendar;
      if (!calendar) {
        return Result.fail('No contribution calendar found');
      }
      // Trouver le max pour le niveau de couleur
      let max = 0;
      for (const week of calendar.weeks) {
        for (const day of week.contributionDays) {
          if (day.contributionCount > max) max = day.contributionCount;
        }
      }
      // Helper pour le niveau de couleur (0-4)
      function getLevel(count: number, max: number): number {
        if (count === 0) return 0;
        if (max === 0) return 0;
        if (count >= max) return 4;
        if (count >= max * 0.75) return 3;
        if (count >= max * 0.5) return 2;
        if (count >= max * 0.25) return 1;
        return 1;
      }
      const graph: ContributionGraph = {
        weeks: calendar.weeks.map((week) => ({
          days: week.contributionDays.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: getLevel(day.contributionCount, max),
          })),
        })),
        totalContributions: calendar.totalContributions,
        maxContributions: max,
      };
      return Result.ok(graph);
    } catch (error) {
      this.Logger.error(
        'Error fetching user contribution graph with GraphQL',
        error,
      );
      return Result.fail(
        'Failed to fetch user contribution graph with GraphQL',
      );
    }
  }
}
