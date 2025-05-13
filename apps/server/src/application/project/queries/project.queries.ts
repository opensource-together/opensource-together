import {
  FindProjectByTitleHandler,
  FindProjectByTitleQuery,
} from './find-by-title/find-project-by-title.handler';
import {
  FindProjectByIdHandler,
  FindProjectByIdQuery,
} from './find-by-id/find-project-by-id.handler';
import {
  GetProjectsHandler,
  GetProjectsQuery,
} from './get-all/get-projects.handler';

export const projectQueriesContainer = [
  FindProjectByTitleHandler,
  FindProjectByTitleQuery,
  FindProjectByIdHandler,
  FindProjectByIdQuery,
  GetProjectsHandler,
  GetProjectsQuery,
];
