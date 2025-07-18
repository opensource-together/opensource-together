import {
  GetAllProjectApplicationsQuery,
  GetAllProjectApplicationsQueryHandler,
} from './get-all-project-application.query';
import {
  GetApplicationByRoleIdQuery,
  GetApplicationByRoleIdQueryHandler,
} from './get-application-by-role-id.query';

export const ProjectRoleApplicationQueries = [
  GetAllProjectApplicationsQuery,
  GetAllProjectApplicationsQueryHandler,
  GetApplicationByRoleIdQuery,
  GetApplicationByRoleIdQueryHandler,
];
