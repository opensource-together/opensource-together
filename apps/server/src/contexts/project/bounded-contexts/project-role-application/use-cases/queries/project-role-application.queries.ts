import {
  GetAllProjectApplicationsQueryByProjectId,
  GetAllProjectApplicationsQueryByProjectIdHandler,
} from './get-all-project-application.query';
import {
  GetApplicationByRoleIdQuery,
  GetApplicationByRoleIdQueryHandler,
} from './get-application-by-role-id.query';
import { GetAllApplicationsByProjectsOwnerQuery } from './get-all-applications-by-projects-owner.query';
import { GetAllApplicationsByProjectsOwnerQueryHandler } from './get-all-applications-by-projects-owner.query';
import { GetApplicationByIdQuery } from './get-application-by-id.query';
import { GetApplicationByIdQueryHandler } from './get-application-by-id.query';
import {
  FindApprovedContributorsByProjectIdQuery,
  FindApprovedContributorsByProjectIdHandler,
} from './find-approved-contributors-by-project-id.query';

export const ProjectRoleApplicationQueries = [
  GetAllProjectApplicationsQueryByProjectId,
  GetAllProjectApplicationsQueryByProjectIdHandler,
  GetApplicationByRoleIdQuery,
  GetApplicationByRoleIdQueryHandler,
  GetAllApplicationsByProjectsOwnerQuery,
  GetAllApplicationsByProjectsOwnerQueryHandler,
  GetApplicationByIdQuery,
  GetApplicationByIdQueryHandler,
  FindApprovedContributorsByProjectIdQuery,
  FindApprovedContributorsByProjectIdHandler,
];
