import { inject, injectable } from "inversify"
import type { IOTPService } from "../../interfaces/services/IOTPService.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import { NotFoundError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class ResendOTPUseCase {
  private otpService: IOTPService
  private emailService: IEmailService
  private developerRepository: IDeveloperRepository
  private companyRepository: ICompanyRepository

  constructor(
    @inject("IOTPService") otpService: IOTPService,
    @inject("IEmailService") emailService: IEmailService,
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
  ) {
    this.otpService = otpService
    this.emailService = emailService
    this.developerRepository = developerRepository
    this.companyRepository = companyRepository
  }

  async execute(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase()
    const developer = await this.developerRepository.findByEmail(normalizedEmail)
    const company = await this.companyRepository.findByEmail(normalizedEmail)

    if (!developer && !company) {
      throw new NotFoundError("User not found")
    }

    const otp = this.otpService.generateOTP()
    await this.otpService.storeOTP(normalizedEmail, otp)
    void this.emailService.sendOTP(normalizedEmail, otp).catch(() => {})
  }
}
