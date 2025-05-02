import { Description } from '@/domain/project/description.vo';
import { Link } from '@/domain/project/link.vo';
import { Project } from '@/domain/project/project.entity';
import { Status } from '@/domain/project/status.vo';
import { Title } from '@/domain/project/title.vo';
import { TechStack } from '@/domain/techStack/techstack.entity';

export class ProjectTestBuilder {
  private id: string = '1';
  private title: string = 'Mon projet';
  private description: string = 'Une description';
  private link: string = 'https://github.com/monprojet';
  private status: string = 'ARCHIVED';
  private userId: string = 'user1';
  private techStacks: TechStack[] = [];

  public static aProject(): ProjectTestBuilder {
    return new ProjectTestBuilder();
  }

  public withId(id: string): ProjectTestBuilder {
    this.id = id;
    return this;
  }

  public withTitle(title: string): ProjectTestBuilder {
    this.title = title;
    return this;
  }

  public withDescription(description: string): ProjectTestBuilder {
    this.description = description;
    return this;
  }

  public withLink(link: string): ProjectTestBuilder {
    this.link = link;
    return this;
  }

  public withStatus(status: string): ProjectTestBuilder {
    this.status = status;
    return this;
  }

  public withUserId(userId: string): ProjectTestBuilder {
    this.userId = userId;
    return this;
  }

  public withTechStacks(techStacks: TechStack[]): ProjectTestBuilder {
    this.techStacks = techStacks;
    return this;
  }

  public buildAsMock(): Project {
    return {
      getId: () => this.id,
      getTitle: () => this.title,
      getDescription: () => this.description,
      getLink: () => this.link,
      getStatus: () => this.status,
      getUserId: () => this.userId,
      getTechStacks: () => this.techStacks,
    } as Project;
  }

  public buildAsPrismaResult() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      link: this.link,
      status: this.status,
      userId: this.userId,
      techStacks: this.techStacks.map((ts) => ({
        id: ts.getId(),
        name: ts.getName(),
        iconUrl: ts.getIconUrl(),
      })),
    };
  }
}
