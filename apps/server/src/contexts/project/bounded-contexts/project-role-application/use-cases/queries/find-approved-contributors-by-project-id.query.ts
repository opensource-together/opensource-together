import { Result } from '@/libs/result';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { 
  PROJECT_ROLE_APPLICATION_REPOSITORY_PORT,
  ProjectRoleApplicationRepositoryPort 
} from '../ports/project-role-application.repository.port';

export type OstContributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  user_id: string;
  contributions: number;
};

export class FindApprovedContributorsByProjectIdQuery implements IQuery {
  constructor(
    public readonly props: {
      projectId: string;
    },
  ) {}
}

@QueryHandler(FindApprovedContributorsByProjectIdQuery)
export class FindApprovedContributorsByProjectIdHandler
  implements IQueryHandler<FindApprovedContributorsByProjectIdQuery>
{
  constructor(
    @Inject(PROJECT_ROLE_APPLICATION_REPOSITORY_PORT)
    private readonly projectRoleApplicationRepository: ProjectRoleApplicationRepositoryPort,
  ) {}

  async execute(
    query: FindApprovedContributorsByProjectIdQuery,
  ): Promise<Result<OstContributor[], string>> {
    const { projectId } = query.props;

    // Récupérer toutes les candidatures pour ce projet
    const applicationsResult = await this.projectRoleApplicationRepository.findAllByProjectId(projectId);
    
    if (!applicationsResult.success) {
      return Result.fail(applicationsResult.error);
    }

    // Filtrer uniquement les candidatures approuvées et regrouper par utilisateur
    const approvedApplications = applicationsResult.value.filter(
      app => app.status === 'APPROVAL'
    );

    // Regrouper par utilisateur pour éviter les doublons
    const contributorsMap = new Map<string, OstContributor>();
    
    approvedApplications.forEach(app => {
      const userId = app.userProfile.id;
      
      if (contributorsMap.has(userId)) {
        // Incrémenter le nombre de contributions pour cet utilisateur
        const existingContributor = contributorsMap.get(userId)!;
        existingContributor.contributions += 1;
      } else {
        // Créer un nouveau contributeur
        contributorsMap.set(userId, {
          login: app.userProfile.username,
          avatar_url: app.userProfile.avatarUrl || '',
          html_url: `http://localhost:4000/v1/user/${userId}`, // Lien vers la page profil
          user_id: userId,
          contributions: 1, // Nombre de rôles approuvés
        });
      }
    });

    // Convertir la Map en tableau et trier par nombre de contributions
    const contributors = Array.from(contributorsMap.values())
      .sort((a, b) => b.contributions - a.contributions);

    return Result.ok(contributors);
  }
}