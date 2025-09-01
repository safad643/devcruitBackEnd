export interface Warning {
  id: string
  entityId: string
  entityType: 'developer' | 'company'
  reason: string
  details?: string
  expectedResolution?: string
  issuedAt: Date
  read: boolean
  createdAt: Date
  updatedAt: Date
}
