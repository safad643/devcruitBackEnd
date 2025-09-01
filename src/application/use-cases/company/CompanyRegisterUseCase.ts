import { inject, injectable } from "inversify"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { IOTPService } from "../../interfaces/services/IOTPService.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import { Company } from "../../../domain/entities/Company.ts"
import { ConflictError } from "../../../domain/errors/DomainError.ts"
import { randomUUID } from "crypto"

@injectable()
export class CompanyRegisterUseCase {
  private companyRepository: ICompanyRepository
  private developerRepository: IDeveloperRepository
  private authService: IAuthService
  private otpService: IOTPService
  private emailService: IEmailService

  constructor(
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("IOTPService") otpService: IOTPService,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.companyRepository = companyRepository
    this.developerRepository = developerRepository
    this.authService = authService
    this.otpService = otpService
    this.emailService = emailService
  }

  async execute(data: {
    fullName: string
    businessEmail: string
    phoneNumber: string
    companyName: string
    companyWebsite: string
    companySize: string
    businessRegistrationNumber: string
    businessAddress: string
    password: string
  }): Promise<void> {
    const normalizedEmail = data.businessEmail.trim().toLowerCase()

    const developerWithEmail = await this.developerRepository.findByEmail(normalizedEmail)
    if (developerWithEmail) {
      throw new ConflictError("Email already in use")
    }

    const existingCompany = await this.companyRepository.findByEmail(normalizedEmail)
    if (existingCompany) {
      if (existingCompany.isVerified || existingCompany.isBlocked) {
        throw new ConflictError("Company already exists")
      }
      const passwordHash = await this.authService.hashPassword(data.password)
      await this.companyRepository.updateById(existingCompany.id, {
        fullName: data.fullName,
        businessEmail: normalizedEmail,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
        companySize: data.companySize,
        businessRegistrationNumber: data.businessRegistrationNumber,
        businessAddress: data.businessAddress,
        passwordHash,
        isVerified: false,
        status: "pending",
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
      })

      const otp = this.otpService.generateOTP()
      await this.otpService.storeOTP(normalizedEmail, otp)
      void this.emailService.sendOTP(normalizedEmail, otp).catch(() => {})
      return
    }

    const passwordHash = await this.authService.hashPassword(data.password)
    const company = new Company(
      randomUUID(),
      data.fullName,
      normalizedEmail,
      data.phoneNumber,
      data.companyName,
      data.companyWebsite,
      data.companySize,
      data.businessRegistrationNumber,
      data.businessAddress,
      passwordHash,
    )

    await this.companyRepository.create(company)

    const otp = this.otpService.generateOTP()
    await this.otpService.storeOTP(normalizedEmail, otp)
    void this.emailService.sendOTP(normalizedEmail, otp).catch(() => {})
  }
}
