import { Result } from '@/libs/result';

export type CategoryData = {
  id: string;
  name: string;
};

export type CategoryPrimitive = CategoryData;

export class Category {
  private readonly id: string;
  private readonly name: string;

  constructor(props: { id: string; name: string }) {
    this.id = props.id;
    this.name = props.name;
  }

  public static reconstitute(props: {
    id: string;
    name: string;
  }): Result<Category, string> {
    const validationResult = Category.validate(props);
    if (!validationResult.success) {
      return Result.fail(validationResult.error);
    }
    return Result.ok(new Category(props));
  }

  public static validate(props: {
    id: string;
    name: string;
  }): Result<Category, string> {
    if (!props.id) {
      return Result.fail('id is required');
    }
    if (!props.name) {
      return Result.fail('name is required');
    }
    return Result.ok(new Category(props));
  }

  public static reconstituteMany(
    props: CategoryData[],
  ): Result<Category[], string> {
    const categories = props.map((p) => Category.reconstitute(p));
    if (!categories.every((c) => c.success)) {
      return Result.fail('Some categories are not valid');
    }
    return Result.ok(categories.map((c) => c.value));
  }

  public toPrimitive(): CategoryPrimitive {
    return {
      id: this.id,
      name: this.name,
    };
  }

  public mapToPrimitive(categories: Category[]): CategoryPrimitive[] {
    return categories.map((category) => category.toPrimitive());
  }
}
