export interface BlockHistory {
  id: string
  entityId: string
  entityType: 'developer' | 'company'
  action: 'blocked' | 'unblocked'
  reason: string
  details?: string
  performedAt: Date
  performedBy?: string
  createdAt: Date
  updatedAt: Date
}
