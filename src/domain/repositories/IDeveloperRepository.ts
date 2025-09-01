import type { Developer } from "../entities/Developer.ts"
import type { DeveloperListQuery } from "../../application/dto/DeveloperDTO.ts"
import type { PaginatedResult } from "../../application/dto/Pagination.ts"

export interface DeveloperUpdate {
  fullName?: string
  email?: string
  phoneNumber?: string
  currentRole?: string
  location?: string
  yearsOfExperience?: number
  experienceLevel?: string
  preferredWorkStyle?: string
  preferredJobType?: string
  skills?: string[]
  bio?: string
  githubUrl?: string
  portfolioUrl?: string
  isFresher?: boolean
  isSelfLearned?: boolean
  techStack?: string[]
  softSkills?: string[]
  workExperience?: any[]
  education?: any[]
  projects?: any[]
  profilePhotoUrl?: string
  cvUrl?: string
  passwordHash?: string
  isVerified?: boolean
  isBlocked?: boolean
  profileSetup?: boolean
  expiresAt?: Date
}

export interface IDeveloperRepository {
  create(developer: Developer): Promise<Developer>
  findByEmail(email: string): Promise<Developer | null>
  findById(id: string): Promise<Developer | null>
  findAll(): Promise<Developer[]>
  searchAndPaginate(query: DeveloperListQuery): Promise<PaginatedResult<Developer>>
  updateVerificationStatus(id: string, isVerified: boolean): Promise<void>
  updateBlockStatus(id: string, isBlocked: boolean): Promise<void>
  updateById(id: string, updates: DeveloperUpdate): Promise<void>
  deleteById(id: string): Promise<void>
}

