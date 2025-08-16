import { Result } from '@/libs/result';

export class ProfileExperience {
  private constructor(
    public readonly company: string,
    public readonly position: string,
    public readonly startDate: Date,
    public readonly endDate: Date | null, // null signifie "aujourd'hui"
  ) {}

  public static create(props: {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
  }): Result<ProfileExperience, string> {
    if (!props.company || !props.position || !props.startDate) {
      return Result.fail(
        'Company, position and start date are required for an experience.',
      );
    }

    const startDate = new Date(props.startDate);
    const endDate = props.endDate ? new Date(props.endDate) : null;

    if (isNaN(startDate.getTime())) {
      return Result.fail('Invalid start date format.');
    }
    if (props.endDate && isNaN(new Date(props.endDate).getTime())) {
      return Result.fail('Invalid end date format.');
    }

    if (endDate && startDate > endDate) {
      return Result.fail('Start date cannot be after end date.');
    }

    return Result.ok(
      new ProfileExperience(props.company, props.position, startDate, endDate),
    );
  }
}
