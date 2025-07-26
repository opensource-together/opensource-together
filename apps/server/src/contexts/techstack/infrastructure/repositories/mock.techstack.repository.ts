import {
  TechStack,
  TechStackPrimitive,
} from '@/contexts/techstack/domain/techstack.entity';
import { TechStackRepositoryPort } from '@/contexts/techstack/use-cases/ports/techstack.repository.port';
import { Result } from '@/libs/result';

// On implémente la même interface que le vrai repository
export class InMemoryTechStackRepository implements TechStackRepositoryPort {
  // Notre "base de données" en mémoire
  private techStacks: TechStackPrimitive[] = [];

  async create(techStack: TechStack): Promise<Result<TechStack, string>> {
    // On ignore l'ID de l'entité entrante et on en assigne un nouveau.
    const newId = String(this.techStacks.length + 1);
    const techStackToRepo = techStack.toPrimitive();
    this.techStacks.push({
      ...techStackToRepo,
      id: newId,
    });
    const newTechStack = this.techStacks[this.techStacks.length - 1];
    const techStackReconstituted = TechStack.reconstitute({
      id: newTechStack.id,
      name: newTechStack.name,
      iconUrl: newTechStack.iconUrl,
      type: newTechStack.type,
    });
    return Promise.resolve(
      techStackReconstituted.success
        ? Result.ok(techStackReconstituted.value)
        : Result.fail(techStackReconstituted.error as string),
    );
  }

  async getAll(): Promise<Result<TechStack[], string>> {
    const techStacks = this.techStacks.map((ts) =>
      TechStack.reconstitute({
        id: ts.id,
        name: ts.name,
        iconUrl: ts.iconUrl,
        type: ts.type,
      }),
    );
    const result = techStacks.map((ts) =>
      ts.success ? ts.value : (ts.error as string),
    );
    return Promise.resolve(Result.ok(result as TechStack[]));
  }

  // Implémentation de la méthode de l'interface
  async findByIds(ids: string[]): Promise<Result<TechStack[], string>> {
    const found = this.techStacks.filter((ts) => ids.includes(ts.id));

    // Vérifier si tous les IDs demandés ont été trouvés
    if (found.length !== ids.length) {
      const foundIds = found.map((ts) => ts.id);
      const notFoundIds = ids.filter((id) => !foundIds.includes(id));
      return Promise.resolve(
        Result.fail(
          `Some tech stacks are not found: ${notFoundIds.join(', ')}`,
        ),
      );
    }

    const techStacks = found.map((ts) =>
      TechStack.reconstitute({
        id: ts.id,
        name: ts.name,
        iconUrl: ts.iconUrl,
        type: ts.type,
      }),
    );

    // Vérifier si toutes les reconstitutions ont réussi
    const failedReconstitutions = techStacks.filter((ts) => !ts.success);
    if (failedReconstitutions.length > 0) {
      return Promise.resolve(Result.fail('Failed to reconstitute tech stacks'));
    }

    const result = techStacks
      .map((ts) => (ts.success ? ts.value : null))
      .filter(Boolean) as TechStack[];
    return Promise.resolve(Result.ok(result));
  }

  async delete(id: string): Promise<Result<boolean, string>> {
    const techStackFound = this.techStacks.find((ts) => ts.id === id);
    if (!techStackFound) {
      return Promise.resolve(Result.fail('Tech stack not found'));
    }
    this.techStacks = this.techStacks.filter((ts) => ts.id !== id);
    return Promise.resolve(Result.ok(true));
  }

  reset(): void {
    this.techStacks = [];
  }
}
