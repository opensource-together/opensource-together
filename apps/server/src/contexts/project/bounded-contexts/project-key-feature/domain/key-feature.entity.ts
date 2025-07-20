import { Result } from '@/libs/result';

export type KeyFeatureData = {
  id?: string;
  projectId?: string;
  feature: string;
};

export type KeyFeatureValidationErrors = {
  id?: string;
  projectId?: string;
  feature?: string;
};

export class KeyFeature {
  private readonly id?: string;
  private readonly projectId?: string;
  private readonly feature: string;
  constructor(props: KeyFeatureData) {
    this.id = props.id;
    this.projectId = props.projectId;
    this.feature = props.feature;
  }

  public static create(
    props: KeyFeatureData,
  ): Result<KeyFeature, KeyFeatureValidationErrors | string> {
    const validationResult = KeyFeature.validate(props);
    if (!validationResult.success) return Result.fail(validationResult.error);
    return Result.ok(new KeyFeature(props));
  }

  public static createMany(
    props: KeyFeatureData[],
  ): Result<KeyFeature[], string> {
    const keyFeatures = props.map((prop) => KeyFeature.create(prop));
    if (!keyFeatures.every((keyFeature) => keyFeature.success))
      return Result.fail('Failed to create key features');
    return Result.ok(keyFeatures.map((keyFeature) => keyFeature.value));
  }

  private static validate(props: {
    id?: string;
    feature: string;
    projectId?: string;
  }): Result<void, KeyFeatureValidationErrors | string> {
    const validationErrors: KeyFeatureValidationErrors = {};
    if (!props.feature) validationErrors.feature = 'Feature is required';
    return Result.ok(undefined);
  }

  public static reconstitute(props: {
    id: string;
    projectId: string;
    feature: string;
  }): Result<KeyFeature, KeyFeatureValidationErrors | string> {
    const validationErrors: KeyFeatureValidationErrors = {};
    if (!props.id) validationErrors.id = 'Id is required';
    if (!props.projectId) validationErrors.projectId = 'Project id is required';
    const voValidationResult = KeyFeature.validate(props);
    if (!voValidationResult.success)
      return Result.fail(voValidationResult.error);
    return Result.ok(new KeyFeature(props));
  }

  public toPrimitive(): {
    id?: string;
    projectId?: string;
    feature: string;
  } {
    return {
      id: this.id,
      projectId: this.projectId,
      feature: this.feature,
    };
  }
}
