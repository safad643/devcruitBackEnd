import { injectable } from "inversify"
import { BlockHistoryModel } from "../database/models/BlockHistoryModel.ts"
import type { IBlockHistoryRepository } from "../../domain/repositories/IBlockHistoryRepository.ts"
import type { BlockHistory } from "../../domain/entities/BlockHistory.ts"

@injectable()
export class BlockHistoryRepository implements IBlockHistoryRepository {
  async create(blockHistory: Omit<BlockHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlockHistory> {
    const doc = new BlockHistoryModel(blockHistory)
    await doc.save()
    
    return {
      id: doc._id.toString(),
      entityId: doc.entityId,
      entityType: doc.entityType,
      action: doc.action,
      reason: doc.reason,
      details: doc.details ?? undefined,
      performedAt: doc.performedAt,
      performedBy: doc.performedBy ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async findByEntityId(entityId: string, entityType: 'developer' | 'company'): Promise<BlockHistory[]> {
    const blockHistory = await BlockHistoryModel.find({ entityId, entityType }).sort({ performedAt: -1 })
    
    return blockHistory.map(doc => ({
      id: doc._id.toString(),
      entityId: doc.entityId,
      entityType: doc.entityType,
      action: doc.action,
      reason: doc.reason,
      details: doc.details ?? undefined,
      performedAt: doc.performedAt,
      performedBy: doc.performedBy ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
  }

  async findById(blockHistoryId: string): Promise<BlockHistory | null> {
    const doc = await BlockHistoryModel.findById(blockHistoryId)
    if (!doc) return null
    
    return {
      id: doc._id.toString(),
      entityId: doc.entityId,
      entityType: doc.entityType,
      action: doc.action,
      reason: doc.reason,
      details: doc.details ?? undefined,
      performedAt: doc.performedAt,
      performedBy: doc.performedBy ?? undefined,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }
}
