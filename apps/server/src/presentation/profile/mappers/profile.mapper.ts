import { FullProfileData } from '@/application/profile/queries/find-profile-by-id.query';
import { ProfileResponseDto } from '../dtos/profile-response.dto';

export class ProfileMapper {
  static toDto(data: FullProfileData): ProfileResponseDto {
    return {
      id: data.profile.getState().userId,
      name: data.profile.getState().name,
      avatarUrl: data.profile.getState().avatarUrl,
      bio: data.profile.getState().bio,
      location: data.profile.getState().location,
      company: data.profile.getState().company,
      socialLinks: data.profile.getState().socialLinks,
      skills: data.profile.getState().skills,
      experiences: data.profile.getState().experiences.map((experience) => ({
        company: experience.company,
        position: experience.position,
        startDate: new Date(experience.startDate).toISOString(),
        endDate: experience.endDate
          ? new Date(experience.endDate).toISOString()
          : null,
      })),
      joinedAt: data.user.getState().createdAt.toISOString(),
      profileUpdatedAt: data.profile.getState().updatedAt.toISOString(),
    };
  }
}
