import { Profile } from '@/contexts/profile/domain/profile.entity';
import { ProfileResponseDto } from './profile-response.dto';
import { ProfileMapper } from '../mappers/profile.mapper';

export class UpdateProfileResponseDto {
  static toResponse(profile: Profile): ProfileResponseDto {
    const profilePrimitive = profile.toPrimitive();
    
    return ProfileMapper.toDto({
      profile: profilePrimitive,
      projects: [], // Les projets ne sont pas inclus dans la mise à jour
    });
  }
}