import { inject, injectable } from "inversify"
import type { IOTPService } from "../../interfaces/services/IOTPService.ts"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import { ValidationError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class VerifyOTPUseCase {
  private otpService: IOTPService
  private developerRepository: IDeveloperRepository
  private companyRepository: ICompanyRepository

  constructor(
    @inject("IOTPService") otpService: IOTPService,
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
  ) {
    this.otpService = otpService
    this.developerRepository = developerRepository
    this.companyRepository = companyRepository
  }

  async execute(email: string, otp: string): Promise<{}> {
    const normalizedEmail = email.trim().toLowerCase()
    const isValidOTP = await this.otpService.verifyOTP(normalizedEmail, otp)
    if (!isValidOTP) {
      throw new ValidationError("Invalid OTP")
    }

    const developer = await this.developerRepository.findByEmail(normalizedEmail)
    if (developer) {      
      await this.developerRepository.updateVerificationStatus(developer.id, true)
      return {}
    }

    const company = await this.companyRepository.findByEmail(normalizedEmail)
    if (company) {
      await this.companyRepository.updateVerificationStatus(company.id, true)
      return {}
    }

    throw new ValidationError("User not found")
  }
}
