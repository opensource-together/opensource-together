import { Result } from '@/libs/result';

export type SkillLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export class ProfileSkill {
  private constructor(
    public readonly name: string,
    public readonly level: SkillLevel,
  ) {}

  public static create(props: {
    name: string;
    level: SkillLevel;
  }): Result<ProfileSkill, string> {
    if (!props.name || !props.level) {
      return Result.fail('Skill name and level are required.');
    }

    const validLevels: SkillLevel[] = [
      'BEGINNER',
      'INTERMEDIATE',
      'ADVANCED',
      'EXPERT',
    ];
    if (!validLevels.includes(props.level)) {
      return Result.fail(`Invalid skill level: ${props.level}`);
    }

    return Result.ok(new ProfileSkill(props.name, props.level));
  }
}
