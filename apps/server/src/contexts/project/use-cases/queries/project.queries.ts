// import {
//   FindProjectByFiltersHandler,
//   FindProjectByFiltersQuery,
// } from './find-by-filters/find-project-by-filters.handler';
import {
  FindProjectByIdHandler,
  FindProjectByIdQuery,
} from './find-by-id/find-project-by-id.handler';
import {
  GetProjectsHandler,
  GetProjectsQuery,
} from './get-all/get-projects.handler';
import {
  FindProjectsByUserIdHandler,
  FindProjectsByUserIdQuery,
} from './find-by-user-id/find-projects-by-user-id.handler';
import {
  FindProjectBySlugHandler,
  FindProjectBySlugQuery,
} from './find-by-slug/find-project-by-slug.handler';

export const projectQueriesContainer = [
  // FindProjectByFiltersHandler,
  // FindProjectByFiltersQuery,
  FindProjectByIdHandler,
  FindProjectByIdQuery,
  GetProjectsHandler,
  GetProjectsQuery,
  FindProjectsByUserIdHandler,
  FindProjectsByUserIdQuery,
  FindProjectBySlugHandler,
  FindProjectBySlugQuery,
];
