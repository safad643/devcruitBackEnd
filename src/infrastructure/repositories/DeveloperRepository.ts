import { injectable } from "inversify"
import mongoose from "mongoose"
import { DeveloperModel } from "../database/models/DeveloperModel.ts"
import type { IDeveloperRepository } from "../../domain/repositories/IDeveloperRepository.ts"
import type { DeveloperListQuery, PaginatedResult } from "../../application/dto/index.ts"
import { Developer } from "../../domain/entities/Developer.ts"
import type { DeveloperUpdate } from "../../domain/repositories/IDeveloperRepository.ts"

function convertDocToDeveloper(doc: any): Developer {
  return new Developer(
    doc._id.toString(),
    doc.fullName,
    doc.email,
    doc.phoneNumber,
    doc.currentRole,
    doc.location,
    doc.yearsOfExperience,
    doc.experienceLevel,
    doc.preferredWorkStyle,
    doc.preferredJobType,
    doc.skills,
    doc.passwordHash,
    doc.bio,
    doc.githubUrl,
    doc.portfolioUrl,
    doc.isFresher,
    doc.isSelfLearned,
    doc.techStack,
    doc.softSkills,
    doc.workExperience,
    doc.education,
    doc.projects,
    doc.profilePhotoUrl,
    doc.cvUrl,
    doc.isVerified,
    doc.isBlocked,
    doc.profileSetup || false,
    doc.createdAt,
    doc.updatedAt,
  )
}

@injectable()
export class DeveloperRepository implements IDeveloperRepository {
  async create(developer: Developer): Promise<Developer> {
    const doc = new DeveloperModel({
      ...developer,
      email: developer.email.toLowerCase().trim(),
      expiresAt: developer.isVerified ? undefined : new Date(Date.now() + 72 * 60 * 60 * 1000),
    })
    await doc.save()
    return developer
  }

  async findByEmail(email: string): Promise<Developer | null> {
    const doc = await DeveloperModel.findOne({ email: email.toLowerCase().trim() })
    if (!doc) return null

    return convertDocToDeveloper(doc)
  }

  async findById(id: string): Promise<Developer | null> {
    const doc = await DeveloperModel.findById(id)
    if (!doc) return null

    return convertDocToDeveloper(doc)
  }

  async findAll(): Promise<Developer[]> {
    const docs = await DeveloperModel.find()
    return docs.map(convertDocToDeveloper)
  }

  async searchAndPaginate(query: DeveloperListQuery): Promise<PaginatedResult<Developer>> {
    const { q, page, pageSize, sortBy = "createdAt", sortOrder = "desc", filters = {} } = query

    const mongoQuery: any = {}
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i")
      mongoQuery.$or = [{ fullName: regex }, { email: regex }, { location: regex }, { currentRole: regex }, { skills: regex }]
    }

    if (typeof (filters as any).isVerified === "boolean") mongoQuery.isVerified = (filters as any).isVerified
    if (typeof (filters as any).isBlocked === "boolean") mongoQuery.isBlocked = (filters as any).isBlocked
    if ((filters as any).experienceLevel) mongoQuery.experienceLevel = (filters as any).experienceLevel
    if ((filters as any).preferredWorkStyle) mongoQuery.preferredWorkStyle = (filters as any).preferredWorkStyle
    if ((filters as any).preferredJobType) mongoQuery.preferredJobType = (filters as any).preferredJobType
    if ((filters as any).location) mongoQuery.location = new RegExp((filters as any).location, "i")
    if (Array.isArray((filters as any).skills) && (filters as any).skills.length > 0) mongoQuery.skills = { $all: (filters as any).skills }
    if (typeof (filters as any).minYears === "number" || typeof (filters as any).maxYears === "number") {
      mongoQuery.yearsOfExperience = {}
      if (typeof (filters as any).minYears === "number") mongoQuery.yearsOfExperience.$gte = (filters as any).minYears
      if (typeof (filters as any).maxYears === "number") mongoQuery.yearsOfExperience.$lte = (filters as any).maxYears
    }

    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    const skip = Math.max(0, (page - 1) * pageSize)
    const [total, docs] = await Promise.all([
      DeveloperModel.countDocuments(mongoQuery),
      DeveloperModel.find(mongoQuery).sort(sort).skip(skip).limit(pageSize),
    ])

    const items = docs.map(convertDocToDeveloper)

    return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
  }

  async updateVerificationStatus(id: string, isVerified: boolean): Promise<void> {
    const update: any = { isVerified }
    if (isVerified) {
      update.$unset = { expiresAt: "" }
    }
    await DeveloperModel.findByIdAndUpdate(id, update)
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<void> {
    await DeveloperModel.findByIdAndUpdate(id, { isBlocked })
  }

  async updateById(id: string, updates: DeveloperUpdate): Promise<void> {
    const updateDoc: Record<string, unknown> = { ...updates }
    if (typeof (updates as any).email === 'string') {
      updateDoc.email = String((updates as any).email).toLowerCase().trim()
    }
    await DeveloperModel.findByIdAndUpdate(id, updateDoc)
  }

  async deleteById(id: string): Promise<void> {
    await DeveloperModel.findByIdAndDelete(id)
  }
}
