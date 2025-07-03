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

export const projectQueriesContainer = [
  // FindProjectByFiltersHandler,
  // FindProjectByFiltersQuery,
  FindProjectByIdHandler,
  FindProjectByIdQuery,
  GetProjectsHandler,
  GetProjectsQuery,
];
