export class PrismaMock {
  public project = {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  };

  public static create(): PrismaMock {
    return new PrismaMock();
  }

  public reset(): void {
    this.project.create.mockReset();
    this.project.findMany.mockReset();
    this.project.findUnique.mockReset();
  }
}
