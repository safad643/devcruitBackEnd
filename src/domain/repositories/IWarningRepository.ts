import type { Warning } from "../entities/Warning.ts"

export interface IWarningRepository {
  create(warning: Omit<Warning, 'id' | 'createdAt' | 'updatedAt'>): Promise<Warning>
  findByEntityId(entityId: string, entityType: 'developer' | 'company'): Promise<Warning[]>
  findUnreadByEntityId(entityId: string, entityType: 'developer' | 'company'): Promise<Warning[]>
  markAsRead(warningId: string): Promise<void>
  findById(warningId: string): Promise<Warning | null>
}
