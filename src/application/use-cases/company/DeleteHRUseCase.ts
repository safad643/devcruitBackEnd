import { inject, injectable } from "inversify"
import type { IHRRepository } from "../../../domain/repositories/IHRRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class DeleteHRUseCase {
  private hrRepository: IHRRepository

  constructor(@inject("IHRRepository") hrRepository: IHRRepository) {
    this.hrRepository = hrRepository
  }

  async execute(hrId: string): Promise<void> {
    const hr = await this.hrRepository.findById(hrId)
    if (!hr) {
      throw new NotFoundError("HR not found")
    }

    await this.hrRepository.delete(hrId)
  }
}
