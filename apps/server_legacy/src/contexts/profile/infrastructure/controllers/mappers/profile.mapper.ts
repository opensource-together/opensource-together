import { FullProfileData } from '@/contexts/profile/use-cases/queries/find-profile-by-id.query';
import { ProfileResponseDto } from '../dtos/profile-response.dto';

export class ProfileMapper {
  static toDto(data: FullProfileData): ProfileResponseDto {
    const userState = data.user.toPrimitive();
    const profileState = data.profile.toPrimitive();

    return {
      id: profileState.userId,
      name: profileState.name,
      avatarUrl: profileState.avatarUrl,
      bio: profileState.bio,
      location: profileState.location,
      company: profileState.company,

      socialLinks: profileState.socialLinks || {},

      techStacks: profileState.techStacks.map((skill) => ({
        name: skill.name,
        id: skill.id,
        type: skill.type,
        iconUrl: skill.iconUrl,
      })),

      experiences: profileState.experiences.map((experience) => ({
        company: experience.company,
        position: experience.position,
        startDate: experience.startDate.toISOString(),
        endDate: experience.endDate?.toISOString() ?? null,
      })),

      projects: profileState.projects.map((project) => ({
        name: project.name,
        description: project.description,
        url: project.url,
      })),

      joinedAt: userState.createdAt?.toISOString() ?? '',
      profileUpdatedAt: profileState.updatedAt?.toISOString() ?? '',
    };
  }
}
