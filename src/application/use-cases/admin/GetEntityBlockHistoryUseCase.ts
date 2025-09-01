import { inject, injectable } from "inversify"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import type { BlockHistory } from "../../../domain/entities/BlockHistory.ts"
import type { GetEntityBlockHistoryDTO } from "../../dto"

@injectable()
export class GetEntityBlockHistoryUseCase {
  private blockHistoryRepository: IBlockHistoryRepository

  constructor(
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
  ) {
    this.blockHistoryRepository = blockHistoryRepository
  }

  async execute(request: GetEntityBlockHistoryDTO): Promise<BlockHistory[]> {
    return await this.blockHistoryRepository.findByEntityId(request.entityId, request.entityType)
  }
}
