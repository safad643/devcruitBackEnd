import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { IOTPService } from "../../interfaces/services/IOTPService.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import { Developer } from "../../../domain/entities/Developer.ts"
import { ConflictError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class DeveloperRegisterUseCase {
  private developerRepository: IDeveloperRepository
  private companyRepository: ICompanyRepository
  private authService: IAuthService
  private otpService: IOTPService
  private emailService: IEmailService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("IOTPService") otpService: IOTPService,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.developerRepository = developerRepository
    this.companyRepository = companyRepository
    this.authService = authService
    this.otpService = otpService
    this.emailService = emailService
  }

  async execute(data: {
    fullName: string
    email: string
    phoneNumber: string
    currentRole: string
    location: string
    yearsOfExperience: number
    experienceLevel: string
    preferredWorkStyle: string
    preferredJobType: string
    password: string
  }): Promise<void> {
    const normalizedEmail = data.email.trim().toLowerCase()

    const companyWithEmail = await this.companyRepository.findByEmail(normalizedEmail)
    if (companyWithEmail) {
      throw new ConflictError("Email already in use")
    }

    const existingDeveloper = await this.developerRepository.findByEmail(normalizedEmail)
    if (existingDeveloper) {
      if (existingDeveloper.isVerified || existingDeveloper.isBlocked) {
        throw new ConflictError("Developer already exists")
      }
      const passwordHash = await this.authService.hashPassword(data.password)
      await this.developerRepository.updateById(existingDeveloper.id, {
        fullName: data.fullName,
        email: normalizedEmail,
        phoneNumber: data.phoneNumber,
        currentRole: data.currentRole,
        location: data.location,
        yearsOfExperience: data.yearsOfExperience,
        experienceLevel: data.experienceLevel,
        preferredWorkStyle: data.preferredWorkStyle,
        preferredJobType: data.preferredJobType,
        passwordHash,
        isVerified: false,
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      })

      const otp = this.otpService.generateOTP()
      await this.otpService.storeOTP(normalizedEmail, otp)
      void this.emailService.sendOTP(normalizedEmail, otp).catch(() => {})
      return
    }

    const passwordHash = await this.authService.hashPassword(data.password)
    const developer = new Developer(
      '',
      data.fullName,
      normalizedEmail,
      data.phoneNumber,
      data.currentRole,
      data.location,
      data.yearsOfExperience,
      data.experienceLevel,
      data.preferredWorkStyle,
      data.preferredJobType,
      [],
      passwordHash,
      false,
      false,
      false,
    )

    await this.developerRepository.create(developer)

    const otp = this.otpService.generateOTP()
    await this.otpService.storeOTP(normalizedEmail, otp)
    void this.emailService.sendOTP(normalizedEmail, otp).catch(() => {})
  }
}
