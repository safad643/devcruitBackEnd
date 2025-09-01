import { injectable } from "inversify"
import { WarningModel } from "../database/models/WarningModel.ts"
import type { IWarningRepository } from "../../domain/repositories/IWarningRepository.ts"
import type { Warning } from "../../domain/entities/Warning.ts"

@injectable()
export class WarningRepository implements IWarningRepository {
  async create(warning: Omit<Warning, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warning> {
    const doc = new WarningModel(warning)
    await doc.save()
    
    return {
      id: doc._id.toString(),
      entityId: doc.entityId,
      entityType: doc.entityType,
      reason: doc.reason,
      details: doc.details ?? undefined,
      expectedResolution: doc.expectedResolution ?? undefined,
      issuedAt: doc.issuedAt,
      read: doc.read,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }

  async findByEntityId(entityId: string, entityType: 'developer' | 'company'): Promise<Warning[]> {
    const warnings = await WarningModel.find({ entityId, entityType }).sort({ issuedAt: -1 })
    
    return warnings.map(doc => ({
      id: doc._id.toString(),
      entityId: doc.entityId,
      entityType: doc.entityType,
      reason: doc.reason,
      details: doc.details ?? undefined,
      expectedResolution: doc.expectedResolution ?? undefined,
      issuedAt: doc.issuedAt,
      read: doc.read,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
  }

  async findUnreadByEntityId(entityId: string, entityType: 'developer' | 'company'): Promise<Warning[]> {
    const warnings = await WarningModel.find({ entityId, entityType, read: false }).sort({ issuedAt: -1 })
    
    return warnings.map(doc => ({
      id: doc._id.toString(),
      entityId: doc.entityId,
      entityType: doc.entityType,
      reason: doc.reason,
      details: doc.details ?? undefined,
      expectedResolution: doc.expectedResolution ?? undefined,
      issuedAt: doc.issuedAt,
      read: doc.read,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))
  }

  async markAsRead(warningId: string): Promise<void> {
    await WarningModel.findByIdAndUpdate(warningId, { read: true })
  }

  async findById(warningId: string): Promise<Warning | null> {
    const doc = await WarningModel.findById(warningId)
    if (!doc) return null
    
    return {
      id: doc._id.toString(),
      entityId: doc.entityId,
      entityType: doc.entityType,
      reason: doc.reason,
      details: doc.details ?? undefined,
      expectedResolution: doc.expectedResolution ?? undefined,
      issuedAt: doc.issuedAt,
      read: doc.read,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }
  }
}
