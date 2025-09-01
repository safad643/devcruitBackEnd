import { inject, injectable } from "inversify"
import type { IWarningRepository } from "../../../domain/repositories/IWarningRepository.ts"
import type { Warning } from "../../../domain/entities/Warning.ts"
import type { GetEntityWarningsDTO } from "../../dto"

@injectable()
export class GetEntityWarningsUseCase {
  private warningRepository: IWarningRepository

  constructor(
    @inject("IWarningRepository") warningRepository: IWarningRepository,
  ) {
    this.warningRepository = warningRepository
  }

  async execute(request: GetEntityWarningsDTO): Promise<Warning[]> {
    if (request.includeRead) {
      return await this.warningRepository.findByEntityId(request.entityId, request.entityType)
    } else {
      return await this.warningRepository.findUnreadByEntityId(request.entityId, request.entityType)
    }
  }
}
