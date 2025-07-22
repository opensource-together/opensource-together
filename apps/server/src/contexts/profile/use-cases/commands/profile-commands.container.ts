import { CreateProfileCommandHandler } from './create-profile.command';
import { UpdateProfileCommandHandler } from './update-profile.command';
import { DeleteProfileCommandHandler } from './delete-profile.command';

export const profileCommandsContainer = [
  CreateProfileCommandHandler,
  UpdateProfileCommandHandler,
  DeleteProfileCommandHandler,
];
