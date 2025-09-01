import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IOTPService } from "../../interfaces/services/IOTPService.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import { ValidationError } from "../../../domain/errors/DomainError.ts"

export type PasswordResetRole = "developer" | "company"

@injectable()
export class ConfirmPasswordResetUseCase {
  private developerRepository: IDeveloperRepository
  private companyRepository: ICompanyRepository
  private otpService: IOTPService
  private authService: IAuthService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IOTPService") otpService: IOTPService,
    @inject("IAuthService") authService: IAuthService,
  ) {
    this.developerRepository = developerRepository
    this.companyRepository = companyRepository
    this.otpService = otpService
    this.authService = authService
  }

  async execute(email: string, role: PasswordResetRole, otp: string, newPassword: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase()
    
    const isValidOTP = await this.otpService.verifyOTP(normalizedEmail, otp)
    if (!isValidOTP) {
      throw new ValidationError("Invalid OTP")
    }

    if (role === "developer") {
      const dev = await this.developerRepository.findByEmail(normalizedEmail)
      if (!dev) throw new ValidationError("User not found")
      const passwordHash = await this.authService.hashPassword(newPassword)
      await this.developerRepository.updateById(dev.id, { passwordHash })
    } else if (role === "company") {
      const comp = await this.companyRepository.findByEmail(normalizedEmail)
      if (!comp) throw new ValidationError("User not found")
      const passwordHash = await this.authService.hashPassword(newPassword)
      await this.companyRepository.updateById(comp.id, { passwordHash })
    } else {
      throw new ValidationError("Unsupported role")
    }
  }
}


