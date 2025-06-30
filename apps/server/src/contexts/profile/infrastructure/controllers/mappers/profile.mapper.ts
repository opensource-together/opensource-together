import { FullProfileData } from '@/contexts/profile/use-cases/queries/find-profile-by-id.query';
import { ProfileResponseDto } from '../dtos/profile-response.dto';

export class ProfileMapper {
  static toDto(data: FullProfileData): ProfileResponseDto {
    const userState = data.user.getState();
    const profileState = data.profile.getState();

    return {
      id: profileState.userId,
      name: profileState.name,
      avatarUrl: profileState.avatarUrl,
      bio: profileState.bio,
      location: profileState.location,
      company: profileState.company,

      socialLinks: profileState.socialLinks.map((link) => ({
        type: link.type,
        url: link.url,
      })),

      skills: profileState.skills.map((skill) => ({
        name: skill.name,
        level: skill.level,
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

      joinedAt: userState.createdAt.toISOString(),
      profileUpdatedAt: profileState.updatedAt?.toISOString() ?? '',
    };
  }
}
