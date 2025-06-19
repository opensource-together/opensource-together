import { Result } from '@/shared/result';
import { SocialLink } from './social-link.vo';
import { ProfileExperience } from './profile-experience.vo';
import { ProfileSkill } from './profile-skill.vo';
import { ProfileProject } from './profile-project.vo';

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
  private updatedAt: Date;

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
    updatedAt: Date;
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
