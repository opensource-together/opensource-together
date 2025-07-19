import { CreateProjectKeyFeatureCommandHandler } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/commands/create-project-key-feature.command';
import { DeleteKeyFeatureCommandHandler } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/commands/project-delete-key-feature.command';
// import { UpdateProjectKeyFeatureCommandHandler } from '@/contexts/project/bounded-contexts/project-key-feature/use-cases/commands/update-project-key-feature.command';

export const projectKeyFeaturesCommands = [
  CreateProjectKeyFeatureCommandHandler,
  DeleteKeyFeatureCommandHandler,
  //   UpdateProjectKeyFeatureCommandHandler,
];
