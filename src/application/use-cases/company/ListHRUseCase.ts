import { inject, injectable } from "inversify"
import type { IHRRepository } from "../../../domain/repositories/IHRRepository.ts"
import type { HR } from "../../../domain/entities/HR.ts"

@injectable()
export class ListHRUseCase {
  private hrRepository: IHRRepository

  constructor(@inject("IHRRepository") hrRepository: IHRRepository) {
    this.hrRepository = hrRepository
  }

  async execute(companyId: string): Promise<HR[]> {
    return this.hrRepository.findByCompanyId(companyId)
  }
}
