import type { BlockHistory } from "../entities/BlockHistory.ts"

export interface IBlockHistoryRepository {
  create(blockHistory: Omit<BlockHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlockHistory>
  findByEntityId(entityId: string, entityType: 'developer' | 'company'): Promise<BlockHistory[]>
  findById(blockHistoryId: string): Promise<BlockHistory | null>
}
