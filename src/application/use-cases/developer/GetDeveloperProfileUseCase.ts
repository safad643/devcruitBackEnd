import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { Developer } from "../../../domain/entities/Developer.ts"
import { ValidationError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class GetDeveloperProfileUseCase {
  constructor(
    @inject("IDeveloperRepository") private readonly developerRepository: IDeveloperRepository,
  ) {}

  async execute(developerId: string): Promise<Developer> {
    const developer = await this.developerRepository.findById(developerId)
    if (!developer) {
      throw new ValidationError("Developer not found")
    }
    
    return developer
  }
}
