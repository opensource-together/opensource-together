// import { TechStack } from '@/domain/techStack/techstack.entity';

// export class TechStackTestBuilder {
//   private id: string = '1';
//   private name: string = 'python';
//   private iconUrl: string = 'http://python';

//   public static aTechStack(): TechStackTestBuilder {
//     return new TechStackTestBuilder();
//   }

//   public withId(id: string): TechStackTestBuilder {
//     this.id = id;
//     return this;
//   }

//   public withName(name: string): TechStackTestBuilder {
//     this.name = name;
//     return this;
//   }

//   public withIconUrl(iconUrl: string): TechStackTestBuilder {
//     this.iconUrl = iconUrl;
//     return this;
//   }

//   public buildAsMock(): TechStack {
//     return {
//       id: this.id,
//       name: this.name,
//       iconUrl: this.iconUrl,
//     };
//   }

//   public buildAsPrismaResult() {
//     return {
//       id: this.id,
//       name: this.name,
//       iconUrl: this.iconUrl,
//     };
//   }
// }
