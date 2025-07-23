import { Profile } from '@/contexts/profile/domain/profile.entity';
import { ProfileResponseDto } from './profile-response.dto';

export class UpdateProfileResponseDto {
  static toResponse(profile: Profile): ProfileResponseDto {
    const profileState = profile.toPrimitive();

    return {
      id: profileState.userId,
      name: profileState.name,
      avatarUrl: profileState.avatarUrl,
      bio: profileState.bio,
      location: profileState.location,
      company: profileState.company,
      socialLinks: profileState.socialLinks.reduce(
        (acc, link) => {
          acc[link.type as keyof typeof acc] = link.url;
          return acc;
        },
        {} as {
          github?: string;
          discord?: string;
          twitter?: string;
          linkedin?: string;
          website?: string;
        },
      ),
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
      joinedAt:
        profileState.updatedAt?.toISOString() ?? new Date().toISOString(),
      profileUpdatedAt:
        profileState.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }
}
