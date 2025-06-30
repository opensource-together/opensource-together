import { Result } from '@/shared/result';
import { SocialLink } from './social-link.vo';
import { ProfileExperience } from './profile-experience.vo';
import { ProfileSkill } from './profile-skill.vo';
import { ProfileProject } from './profile-project.vo';
import { SocialLinkType } from './social-link.vo';
import { SkillLevel } from './profile-skill.vo';

export class Profile {
  private readonly userId: string;
  private name: string;
  private avatarUrl: string;
  private bio: string;
  private location: string;
  private company: string;

  private socialLinks: SocialLink[];
  private skills: ProfileSkill[];
  private experiences: ProfileExperience[];
  private projects: ProfileProject[];
  private updatedAt?: Date;

  private constructor(props: {
    userId: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    company?: string;
    socialLinks?: SocialLink[];
    skills?: ProfileSkill[];
    experiences?: ProfileExperience[];
    projects?: ProfileProject[];
    updatedAt?: Date;
  }) {
    this.userId = props.userId;
    this.name = props.name;
    this.avatarUrl = props.avatarUrl || '';
    this.bio = props.bio || '';
    this.location = props.location || '';
    this.company = props.company || '';
    this.socialLinks = props.socialLinks || [];
    this.skills = props.skills || [];
    this.experiences = props.experiences || [];
    this.projects = props.projects || [];
    this.updatedAt = props.updatedAt;
  }

  public static create(props: {
    userId: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    company?: string;
    socialLinks?: { type: string; url: string }[];
    skills?: { name: string; level: string }[];
    experiences?: {
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
    }[];
    projects?: { name: string; description: string; url: string }[];
  }): Result<Profile, string> {
    if (!props.userId || !props.name) {
      return Result.fail('userId and name are required to create a profile.');
    }

    if (props.bio && props.bio.length > 1000) {
      return Result.fail('Bio must be less than 1000 characters.');
    }

    const socialLinkVOs: SocialLink[] = [];
    for (const linkData of props.socialLinks || []) {
      if (!linkData.url) continue;

      const socialLinkResult = SocialLink.create({
        type: linkData.type as SocialLinkType,
        url: linkData.url,
      });
      if (!socialLinkResult.success) {
        return Result.fail(socialLinkResult.error);
      }
      socialLinkVOs.push(socialLinkResult.value);
    }

    const experienceVOs: ProfileExperience[] = [];
    for (const expData of props.experiences || []) {
      const experienceResult = ProfileExperience.create(expData);
      if (!experienceResult.success) {
        return Result.fail(experienceResult.error);
      }
      experienceVOs.push(experienceResult.value);
    }

    const projectVOs: ProfileProject[] = [];
    for (const projectData of props.projects || []) {
      const projectResult = ProfileProject.create(projectData);
      if (!projectResult.success) {
        return Result.fail(projectResult.error);
      }
      projectVOs.push(projectResult.value);
    }

    const skillVOs: ProfileSkill[] = [];
    for (const skillData of props.skills || []) {
      const skillResult = ProfileSkill.create({
        name: skillData.name,
        level: skillData.level as SkillLevel,
      });
      if (!skillResult.success) {
        return Result.fail(skillResult.error);
      }
      skillVOs.push(skillResult.value);
    }

    return Result.ok(
      new Profile({
        userId: props.userId,
        name: props.name,
        avatarUrl: props.avatarUrl,
        bio: props.bio,
        location: props.location,
        company: props.company,
        socialLinks: socialLinkVOs,
        skills: skillVOs,
        experiences: experienceVOs,
        projects: projectVOs,
      }),
    );
  }

  public static reconstitute(props: {
    userId: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    company?: string;
    socialLinks?: SocialLink[];
    skills?: ProfileSkill[];
    experiences?: ProfileExperience[];
    projects?: ProfileProject[];
    updatedAt: Date;
  }): Profile {
    // Appelle directement le constructeur pour "re-créer" l'objet à partir de la BDD
    return new Profile(props);
  }

  // Les méthodes métier deviennent plus simples
  public addExperience(experience: ProfileExperience): void {
    this.experiences.push(experience);
  }

  public addSocialLink(link: SocialLink): Result<string, string> {
    const existingLink = this.socialLinks.find((l) => l.type === link.type);
    if (existingLink) {
      return Result.fail(`A social link of type ${link.type} already exists.`);
    }
    this.socialLinks.push(link);
    return Result.ok('');
  }

  public addProject(project: ProfileProject): Result<string, string> {
    const existingProject = this.projects.find((p) => p.name === project.name);
    if (existingProject) {
      return Result.fail(`A project with name ${project.name} already exists.`);
    }
    this.projects.push(project);
    return Result.ok('');
  }

  // ... autres méthodes métier (`updateInfo`, `addSkill`, etc.)

  public getState() {
    return {
      userId: this.userId,
      name: this.name,
      avatarUrl: this.avatarUrl,
      bio: this.bio,
      location: this.location,
      company: this.company,
      updatedAt: this.updatedAt,
      socialLinks: this.socialLinks,
      skills: this.skills,
      experiences: this.experiences,
      projects: this.projects,
    };
  }
}
