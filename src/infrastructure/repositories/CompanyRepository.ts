import { injectable } from "inversify"
import { CompanyModel } from "../database/models/CompanyModel.ts"
import type { ICompanyRepository } from "../../domain/repositories/ICompanyRepository.ts"
import type { CompanyListQuery, PaginatedResult } from "../../application/dto/index.ts"
import { Company } from "../../domain/entities/Company.ts"
import type { CompanyUpdate } from "../../domain/repositories/ICompanyRepository.ts"

@injectable()
export class CompanyRepository implements ICompanyRepository {
  async create(company: Company): Promise<Company> {
    const doc = new CompanyModel({
      ...company,
      businessEmail: company.businessEmail.toLowerCase().trim(),
      expiresAt: company.isVerified ? undefined : new Date(Date.now() + 72 * 60 * 60 * 1000),
    })
    await doc.save()
    return company
  }

  async findByEmail(email: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({ businessEmail: email.toLowerCase().trim() })
    if (!company) return null
    return new Company(
      company._id.toString(),
      company.fullName,
      company.businessEmail,
      company.phoneNumber,
      company.companyName,
      company.companyWebsite,
      company.companySize,
      company.businessRegistrationNumber,
      company.businessAddress,
      company.passwordHash,
      company.isVerified,
      company.status,
      company.isBlocked,
      company.declineReason ?? undefined,
      Array.isArray((company as any).requestedDocuments) ? ((company as any).requestedDocuments as string[]) : undefined,
      company.createdAt,
      company.updatedAt,
    )
  }

  async findById(id: string): Promise<Company | null> {
    const company = await CompanyModel.findById(id)
    if (!company) return null
    return new Company(
      company._id.toString(),
      company.fullName,
      company.businessEmail,
      company.phoneNumber,
      company.companyName,
      company.companyWebsite,
      company.companySize,
      company.businessRegistrationNumber,
      company.businessAddress,
      company.passwordHash,
      company.isVerified,
      company.status,
      company.isBlocked,
      company.declineReason ?? undefined,
      Array.isArray((company as any).requestedDocuments) ? ((company as any).requestedDocuments as string[]) : undefined,
      company.createdAt,
      company.updatedAt,
    )
  }

  async findAll(): Promise<Company[]> {
    const companies = await CompanyModel.find()
    return companies.map(
      (comp) =>
        new Company(
          comp._id.toString(),
          comp.fullName,
          comp.businessEmail,
          comp.phoneNumber,
          comp.companyName,
          comp.companyWebsite,
          comp.companySize,
          comp.businessRegistrationNumber,
          comp.businessAddress,
          comp.passwordHash,
          comp.isVerified,
          comp.status,
          comp.isBlocked,
          (comp as any).declineReason ?? undefined,
          Array.isArray((comp as any).requestedDocuments) ? ((comp as any).requestedDocuments as string[]) : undefined,
          comp.createdAt,
          comp.updatedAt,
        ),
    )
  }

  async searchAndPaginate(query: CompanyListQuery): Promise<PaginatedResult<Company>> {
    const { q, page, pageSize, sortBy = "createdAt", sortOrder = "desc", filters = {} } = query

    const mongoQuery: any = {}
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i")
      mongoQuery.$or = [
        { companyName: regex },
        { businessEmail: regex },
        { companyWebsite: regex },
        { businessRegistrationNumber: regex },
      ]
    }

    if (typeof (filters as any).isVerified === "boolean") mongoQuery.isVerified = (filters as any).isVerified
    if (typeof (filters as any).isBlocked === "boolean") mongoQuery.isBlocked = (filters as any).isBlocked
    if ((filters as any).status) mongoQuery.status = (filters as any).status
    if ((filters as any).companySize) mongoQuery.companySize = (filters as any).companySize

    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    const skip = Math.max(0, (page - 1) * pageSize)
    const [total, docs] = await Promise.all([
      CompanyModel.countDocuments(mongoQuery),
      CompanyModel.find(mongoQuery).sort(sort).skip(skip).limit(pageSize),
    ])

    const items = docs.map(
      (company) =>
        new Company(
          company._id.toString(),
          company.fullName,
          company.businessEmail,
          company.phoneNumber,
          company.companyName,
          company.companyWebsite,
          company.companySize,
          company.businessRegistrationNumber,
          company.businessAddress,
          company.passwordHash,
          company.isVerified,
          company.status,
          company.isBlocked,
          (company as any).declineReason ?? undefined,
          Array.isArray((company as any).requestedDocuments) ? ((company as any).requestedDocuments as string[]) : undefined,
          company.createdAt,
          company.updatedAt,
        ),
    )

    return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async updateVerificationStatus(id: string, isVerified: boolean): Promise<void> {
    const update: any = { isVerified }
    if (isVerified) {
      update.$unset = { expiresAt: "" }
    }
    await CompanyModel.findByIdAndUpdate(id, update)
  }

  async updateStatus(id: string, status: "pending" | "approved" | "declined" | "resubmitted" | "paid"): Promise<void> {
    await CompanyModel.findByIdAndUpdate(id, { status })
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<void> {
    await CompanyModel.findByIdAndUpdate(id, { isBlocked, ...(isBlocked ? {} : { $unset: { blockedReason: "", blockedDetails: "" } }) })
  }

  async updateById(id: string, updates: CompanyUpdate): Promise<void> {
    const updateDoc: Record<string, unknown> = { ...updates }
    if (typeof (updates as any).businessEmail === 'string') {
      updateDoc.businessEmail = String((updates as any).businessEmail).toLowerCase().trim()
    }
    await CompanyModel.findByIdAndUpdate(id, updateDoc)
  }

  async getPendingVerifiedCount(): Promise<number> {
    return CompanyModel.countDocuments({ 
      status: "pending", 
      isVerified: true,
      isBlocked: false 
    })
  }

  async entityExists(id: string): Promise<boolean> {
    const count = await CompanyModel.countDocuments({ _id: id })
    return count > 0
  }
}
