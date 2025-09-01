import type { HR } from "../entities/HR.ts"

export interface IHRRepository {
  create(hr: HR): Promise<HR>
  findById(id: string): Promise<HR | null>
  findByUsername(username: string): Promise<HR | null>
  findByCompanyId(companyId: string): Promise<HR[]>
  update(id: string, data: Partial<HR>): Promise<void>
  delete(id: string): Promise<void>
  updateBlockStatus(id: string, isBlocked: boolean, reason?: string): Promise<void>
}
