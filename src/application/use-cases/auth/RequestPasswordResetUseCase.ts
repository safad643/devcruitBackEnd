import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IOTPService } from "../../interfaces/services/IOTPService.ts"
import type { IEmailService } from "../../interfaces/services/IEmailService.ts"
import { ValidationError, NotFoundError } from "../../../domain/errors/DomainError.ts"

export type PasswordResetRole = "developer" | "company"

@injectable()
export class RequestPasswordResetUseCase {
  private developerRepository: IDeveloperRepository
  private companyRepository: ICompanyRepository
  private otpService: IOTPService
  private emailService: IEmailService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IOTPService") otpService: IOTPService,
    @inject("IEmailService") emailService: IEmailService,
  ) {
    this.developerRepository = developerRepository
    this.companyRepository = companyRepository
    this.otpService = otpService
    this.emailService = emailService
  }

  async execute(email: string, role: PasswordResetRole): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase()

    if (role === "developer") {
      const dev = await this.developerRepository.findByEmail(normalizedEmail)
      if (!dev) throw new NotFoundError("User not found")
    } else if (role === "company") {
      const comp = await this.companyRepository.findByEmail(normalizedEmail)
      if (!comp) throw new NotFoundError("User not found")
    } else {
      throw new ValidationError("Unsupported role")
    }

    const otp = this.otpService.generateOTP()
    await this.otpService.storeOTP(normalizedEmail, otp)
    void this.emailService.sendOTP(normalizedEmail, otp).catch(() => {})
  }
}


