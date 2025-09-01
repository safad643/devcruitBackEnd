import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { DeveloperListQuery, PaginatedResult } from "../../dto/index.ts"
import type { Developer } from "../../../domain/entities/Developer.ts"

@injectable()
export class ListDevelopersUseCase {
  private developerRepository: IDeveloperRepository

  constructor(@inject("IDeveloperRepository") developerRepository: IDeveloperRepository) {
    this.developerRepository = developerRepository
  }

  async execute(query: DeveloperListQuery): Promise<PaginatedResult<Developer>> {
    return await this.developerRepository.searchAndPaginate(query)
  }
}
