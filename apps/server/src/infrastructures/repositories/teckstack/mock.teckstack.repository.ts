import {
  TechStack,
  TechStackPrimitive,
} from '@/domain/techStack/techstack.entity';
import { Result } from '@/shared/result';
import { TechStackRepositoryPort } from '@/application/teckstack/ports/techstack.repository.port';

// On implémente la même interface que le vrai repository
export class InMemoryTechStackRepository implements TechStackRepositoryPort {
  // Notre "base de données" en mémoire
  private techStacks: TechStackPrimitive[] = [];
  async create(techStack: TechStack): Promise<Result<TechStack>> {
    // On ignore l'ID de l'entité entrante et on en assigne un nouveau.
    const newId = String(this.techStacks.length + 1);
    const techStackToRepo = techStack.toPrimitive();
    this.techStacks.push({
      ...techStackToRepo,
      id: newId,
    });
    const newTechStack = this.techStacks[this.techStacks.length - 1];
    const techStackReconstituted = TechStack.reconstitute({
      id: newTechStack.id as string,
      name: newTechStack.name,
      iconUrl: newTechStack.iconUrl,
    });
    return Promise.resolve(
      techStackReconstituted.success
        ? Result.ok(techStackReconstituted.value)
        : Result.fail(techStackReconstituted.error as string),
    );
  }

  async getAll(): Promise<Result<TechStack[]>> {
    const techStacks = this.techStacks.map((ts) =>
      TechStack.reconstitute({
        id: ts.id as string,
        name: ts.name,
        iconUrl: ts.iconUrl,
      }),
    );
    const result = techStacks.map((ts) =>
      ts.success ? ts.value : (ts.error as string),
    );
    return Promise.resolve(Result.ok(result as TechStack[]));
  }

  // Implémentation de la méthode de l'interface
  async findByIds(ids: string[]): Promise<Result<TechStack[]>> {
    const found = this.techStacks.filter((ts) => ids.includes(ts.id as string));
    const techStacks = found.map((ts) =>
      TechStack.reconstitute({
        id: ts.id as string,
        name: ts.name,
        iconUrl: ts.iconUrl,
      }),
    );
    const result = techStacks.map((ts) =>
      ts.success ? ts.value : (ts.error as string),
    );
    return Promise.resolve(Result.ok(result as TechStack[]));
  }

  async delete(id: string): Promise<Result<boolean>> {
    const techStackFound = this.techStacks.find((ts) => ts.id === id);
    if (!techStackFound) {
      return Promise.resolve(Result.fail('Tech stack not found'));
    }
    this.techStacks = this.techStacks.filter((ts) => ts.id !== id);
    console.log('techStacks', this.techStacks);
    return Promise.resolve(Result.ok(true));
  }

  // Vous implémenteriez les autres méthodes du port ici (create, findOne, etc.)
  // pour les tests qui en ont besoin.
}
