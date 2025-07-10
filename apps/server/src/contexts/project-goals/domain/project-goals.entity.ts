import { Result } from '@/libs/result';

export type ProjectGoalsData = {
  id?: string;
  projectId?: string;
  goal: string;
};

export type ProjectGoalsValidationErrors = {
  id?: string;
  projectId?: string;
  goal?: string;
};

export class ProjectGoals {
  private readonly id?: string;
  private readonly projectId?: string;
  private readonly goal: string;

  constructor(props: { id?: string; projectId?: string; goal: string }) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.goal = props.goal;
  }

  public static create(
    props: ProjectGoalsData,
  ): Result<ProjectGoals, ProjectGoalsValidationErrors | string> {
    const validationResult = ProjectGoals.validate(props);
    if (!validationResult.success) return Result.fail(validationResult.error);
    return Result.ok(new ProjectGoals(props));
  }

  public static createMany(
    props: ProjectGoalsData[],
  ): Result<ProjectGoals[], string> {
    const projectGoals = props.map((prop) => ProjectGoals.create(prop));
    if (!projectGoals.every((projectGoal) => projectGoal.success))
      return Result.fail('Failed to create project goals');
    return Result.ok(projectGoals.map((projectGoal) => projectGoal.value));
  }

  public static reconstitute(
    props: ProjectGoalsData,
  ): Result<ProjectGoals, ProjectGoalsValidationErrors | string> {
    if (!props.id) return Result.fail('Id is required');
    if (!props.projectId) return Result.fail('Project id is required');
    const voValidationResult = ProjectGoals.validate(props);
    if (!voValidationResult.success)
      return Result.fail(voValidationResult.error);
    return Result.ok(new ProjectGoals(props));
  }

  private static validate(
    props: ProjectGoalsData,
  ): Result<void, ProjectGoalsValidationErrors | string> {
    const validationErrors: ProjectGoalsValidationErrors = {};
    if (!props.goal) validationErrors.goal = 'Goals are required';
    if (Object.keys(validationErrors).length > 0)
      return Result.fail(validationErrors);
    return Result.ok(undefined);
  }

  public toPrimitive(): ProjectGoalsData {
    return {
      id: this.id,
      projectId: this.projectId,
      goal: this.goal,
    };
  }
}
