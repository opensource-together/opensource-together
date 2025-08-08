// apps/server/src/contexts/user/domain/user.entity.ts

import { ProfileExperience } from '@/contexts/profile/domain/profile-experience.vo';
import { ProfileProject } from '@/contexts/profile/domain/profile-project.vo';
import { Email } from '@/contexts/user/domain/email.vo';
import { GitHubStats } from '@/contexts/user/domain/github-stats.vo';
import { Username } from '@/contexts/user/domain/username.vo';
import { Result } from '@/libs/result';

export type UserPublic = Omit<User, 'email' | 'login'>;

export class User {
  private readonly id: string;
  private username: Username;
  private email: Email;
  private provider: string;
  private login: string;
  private avatarUrl: string;
  private location: string;
  private company: string;
  private bio: string;
  private jobTitle: string;
  private socialLinks?: {
    github?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    discord?: string;
  };
  private techStacks: {
    id: string;
    name: string;
    iconUrl: string;
    type: 'LANGUAGE' | 'TECH';
  }[];
  private experiences: ProfileExperience[];
  private projects: ProfileProject[];
  private githubStats?: GitHubStats;

  private readonly createdAt?: Date;
  private readonly updatedAt?: Date;

  // Le constructeur est le SEUL moyen de créer un User.
  // Il garantit qu'un User ne peut pas exister dans un état invalide.
  private constructor(props: {
    id: string;
    username: Username;
    email: Email;
    provider: string;
    login: string;
    avatarUrl?: string;
    location?: string;
    company?: string;
    bio?: string;
    jobTitle?: string;
    socialLinks?: {
      github?: string;
      website?: string;
      twitter?: string;
      linkedin?: string;
      discord?: string;
    };
    techStacks?: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[];
    experiences?: ProfileExperience[];
    projects?: ProfileProject[];
    githubStats?: GitHubStats;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.provider = props.provider;
    this.login = props.login;
    this.avatarUrl = props.avatarUrl || '';
    this.location = props.location || '';
    this.company = props.company || '';
    this.bio = props.bio || '';
    this.jobTitle = props.jobTitle || '';
    this.socialLinks = props.socialLinks;
    this.techStacks = props.techStacks || [];
    this.experiences = props.experiences || [];
    this.projects = props.projects || [];
    this.githubStats = props.githubStats;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public static create(props: {
    id: string;
    username: string;
    email: string;
    provider: string;
    login: string;
    avatarUrl?: string;
    location?: string;
    company?: string;
    bio?: string;
    jobTitle?: string;
    socialLinks?: {
      github?: string;
      website?: string;
      twitter?: string;
      linkedin?: string;
      discord?: string;
    };
    techStacks?: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[];
    experiences?: {
      company: string;
      position: string;
      startDate: string;
      endDate?: string;
    }[];
    projects?: { name: string; description: string; url: string }[];
  }): Result<
    User,
    | {
        id?: string;
        username?: string;
        email?: string;
        // name?: string;
        bio?: string;
      }
    | string
  > {
    const validateResult = this.validate(props);
    if (!validateResult.success) {
      return Result.fail(validateResult.error);
    }

    // Validation de la bio
    if (props.bio && props.bio.length > 1000) {
      return Result.fail('Bio must be less than 1000 characters.');
    }

    // Création des experiences
    const experienceVOs: ProfileExperience[] = [];
    for (const expData of props.experiences || []) {
      const experienceResult = ProfileExperience.create(expData);
      if (!experienceResult.success) {
        return Result.fail(experienceResult.error);
      }
      experienceVOs.push(experienceResult.value);
    }

    // Création des projets
    const projectVOs: ProfileProject[] = [];
    for (const projectData of props.projects || []) {
      const projectResult = ProfileProject.create(projectData);
      if (!projectResult.success) {
        return Result.fail(projectResult.error);
      }
      projectVOs.push(projectResult.value);
    }

    return Result.ok(
      new User({
        id: props.id,
        username: validateResult.value.username,
        email: validateResult.value.email,
        provider: props.provider,
        login: props.login,
        avatarUrl: props.avatarUrl,
        location: props.location,
        company: props.company,
        bio: props.bio,
        jobTitle: props.jobTitle,
        socialLinks: props.socialLinks,
        techStacks: props.techStacks || [],
        experiences: experienceVOs,
        projects: projectVOs,
      }),
    );
  }

  public static reconstitute(props: {
    id: string;
    username: string;
    email: string;
    provider: string;
    login: string;
    avatarUrl?: string;
    location?: string;
    company?: string;
    bio?: string;
    jobTitle?: string;
    socialLinks?: {
      github?: string;
      website?: string;
      twitter?: string;
      linkedin?: string;
      discord?: string;
    };
    techStacks?: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[];
    experiences?: ProfileExperience[];
    projects?: ProfileProject[];
    githubStats?: GitHubStats;
    createdAt: Date;
    updatedAt: Date;
  }): Result<
    User,
    | {
        username?: string;
        email?: string; // name?: string
      }
    | string
  > {
    const validUser = this.validate(props);
    if (!validUser.success) {
      return Result.fail(validUser.error);
    }
    return Result.ok(
      new User({
        id: validUser.value.id,
        username: validUser.value.username,
        email: validUser.value.email,
        provider: props.provider,
        login: props.login,
        avatarUrl: props.avatarUrl,
        location: props.location,
        company: props.company,
        bio: props.bio,
        jobTitle: props.jobTitle,
        socialLinks: props.socialLinks,
        techStacks: props.techStacks,
        experiences: props.experiences,
        projects: props.projects,
        githubStats: props.githubStats,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      }),
    );
  }

  public static validate(props: {
    id: string;
    username: string;
    email: string;
    provider: string;
  }): Result<
    { id: string; username: Username; email: Email },
    { id?: string; username?: string; email?: string } | string
  > {
    const error: {
      id?: string;
      username?: string;
      email?: string;
      // name?: string;
    } = {};

    if (!props.id) {
      error.id = 'User id is required';
    }

    // if (!props.name) {
    //   error.name = 'User name is required';
    // }

    const usernameVo = Username.create(props.username);
    const emailVo = Email.create(props.email);

    if (!emailVo.success) error.email = emailVo.error;
    if (!usernameVo.success) error.username = usernameVo.error;

    if (!usernameVo.success || !emailVo.success) {
      return Result.fail(error);
    }

    return Result.ok({
      id: props.id,
      username: usernameVo.value,
      email: emailVo.value,
      // name: props.name,
    });
  }

  // Méthodes métier pour gérer les changements
  public changeUsername(newUsername: string) {
    const usernameVo = Username.create(newUsername);
    if (!usernameVo.success) return Result.fail({ username: usernameVo.error });
    this.username = usernameVo.value;
    return Result.ok('Username updated successfully');
  }

  public changeEmail(newEmail: string) {
    const emailVo = Email.create(newEmail);
    if (!emailVo.success) return Result.fail({ email: emailVo.error });
    this.email = emailVo.value;
    return Result.ok('Email updated successfully');
  }

  public hideEmail(hide: boolean) {
    if (hide) {
      this.email = this.email.hideEmail();
    }
  }

  public hideLogin(hide: boolean) {
    if (hide) {
      this.login = '';
    }
  }

  public updateProfile(props: {
    username?: string;
    login?: string;
    avatarUrl?: string;
    location?: string;
    company?: string;
    bio?: string;
    jobTitle?: string;
    socialLinks?: {
      github?: string;
      website?: string;
      twitter?: string;
      linkedin?: string;
      discord?: string;
    };
  }): Result<string, string> {
    if (props.bio && props.bio.length > 1000) {
      return Result.fail('Bio must be less than 1000 characters.');
    }

    if (props.username) {
      const usernameVo = Username.create(props.username);
      if (!usernameVo.success) return Result.fail(usernameVo.error);
      this.username = usernameVo.value;
    }
    if (props.login) this.login = props.login;
    if (props.avatarUrl !== undefined) this.avatarUrl = props.avatarUrl;
    if (props.location !== undefined) this.location = props.location;
    if (props.company !== undefined) this.company = props.company;
    if (props.bio !== undefined) this.bio = props.bio;
    if (props.jobTitle !== undefined) this.jobTitle = props.jobTitle;
    if (props.socialLinks !== undefined) this.socialLinks = props.socialLinks;

    return Result.ok('Profile updated successfully');
  }

  public addExperience(experience: ProfileExperience): void {
    this.experiences.push(experience);
  }

  public addProject(project: ProfileProject): Result<string, string> {
    const existingProject = this.projects.find((p) => p.name === project.name);
    if (existingProject) {
      return Result.fail(`A project with name ${project.name} already exists.`);
    }
    this.projects.push(project);
    return Result.ok('Project added successfully');
  }

  public updateTechStacks(
    techStacks: {
      id: string;
      name: string;
      iconUrl: string;
      type: 'LANGUAGE' | 'TECH';
    }[],
  ): void {
    this.techStacks = techStacks;
  }

  public updateGitHubStats(stats: GitHubStats): void {
    this.githubStats = stats;
  }

  public getGitHubStats(): GitHubStats | undefined {
    return this.githubStats;
  }

  // Getters pour l'accès en lecture seule

  // Getters pour l'accès en lecture seule
  public getId(): string {
    return this.id;
  }

  public getUsername(): string {
    return this.username.getUsername();
  }

  public getEmail(): string {
    return this.email.getEmail();
  }

  // public getName(): string {
  //   return this.name;
  // }

  public getLogin(): string {
    return this.login;
  }

  // On expose une méthode pour extraire l'état à des fins de persistance ou de DTO.
  public toPrimitive() {
    return {
      id: this.id,
      username: this.username.getUsername(),
      email: this.email.getEmail(),
      provider: this.provider,
      login: this.login,
      avatarUrl: this.avatarUrl,
      location: this.location,
      company: this.company,
      bio: this.bio,
      jobTitle: this.jobTitle,
      socialLinks: this.socialLinks,
      techStacks: this.techStacks,
      experiences: this.experiences,
      projects: this.projects,
      githubStats: this.githubStats?.toPrimitive() || null,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
