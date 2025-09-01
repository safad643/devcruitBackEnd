import type { Interviewer } from "../entities/Interviewer.ts"

export interface IInterviewerRepository {
  create(interviewer: Interviewer): Promise<Interviewer>
  findById(id: string): Promise<Interviewer | null>
  findByUsername(username: string): Promise<Interviewer | null>
  findByCompanyId(companyId: string): Promise<Interviewer[]>
  update(id: string, data: Partial<Interviewer>): Promise<void>
  delete(id: string): Promise<void>
  updateBlockStatus(id: string, isBlocked: boolean, reason?: string): Promise<void>
}
