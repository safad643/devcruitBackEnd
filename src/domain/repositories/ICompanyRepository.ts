import type { Company } from "../entities/Company.ts"
import type { CompanyListQuery } from "../../application/dto/CompanyDTO.ts"
import type { PaginatedResult } from "../../application/dto/Pagination.ts"

export interface CompanyUpdate {
  fullName?: string
  businessEmail?: string
  phoneNumber?: string
  companyName?: string
  companyWebsite?: string
  companySize?: string
  businessRegistrationNumber?: string
  businessAddress?: string
  passwordHash?: string
  isVerified?: boolean
  status?: "pending" | "approved" | "declined" | "resubmitted" | "paid"
  isBlocked?: boolean
  blockedReason?: string
  blockedDetails?: string
  declineReason?: string
  requestedDocuments?: string[]
  additionalDocuments?: Array<{ name: string; type: 'file' | 'explanation'; url?: string; text?: string }>
  resubmissionNotes?: string
  planName?: string
  expiresAt?: Date
}

export interface ICompanyRepository {
  create(company: Company): Promise<Company>
  findByEmail(email: string): Promise<Company | null>
  findById(id: string): Promise<Company | null>
  findAll(): Promise<Company[]>
  searchAndPaginate(query: CompanyListQuery): Promise<PaginatedResult<Company>>
  getPendingVerifiedCount(): Promise<number>
  updateVerificationStatus(id: string, isVerified: boolean): Promise<void>
  updateStatus(id: string, status: "pending" | "approved" | "declined" | "resubmitted" | "paid"): Promise<void>
  updateBlockStatus(id: string, isBlocked: boolean): Promise<void>
  updateById(id: string, updates: CompanyUpdate): Promise<void>
}
