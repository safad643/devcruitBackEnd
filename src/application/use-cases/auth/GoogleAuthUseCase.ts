import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository.ts"
import type { IAdminRepository } from "../../../domain/repositories/IAdminRepository.ts"
import type { IHRRepository } from "../../../domain/repositories/IHRRepository.ts"
import type { IInterviewerRepository } from "../../../domain/repositories/IInterviewerRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import type { ICacheService } from "../../interfaces/services/ICacheService.ts"
import type { IBlockHistoryRepository } from "../../../domain/repositories/IBlockHistoryRepository.ts"
import { AuthError } from "../../../domain/errors/DomainError.ts"

type GoogleUserInfo = {
  email: string
  name: string
  picture?: string
  sub: string
}

type AuthResult = {
  loggedIn: boolean
  accessToken?: string
  refreshToken?: string
  isBlocked?: boolean
  blockedReason?: string
  blockedDetails?: string
  profileSetup?: boolean
  role?: string
}

@injectable()
export class GoogleAuthUseCase {
  private developerRepository: IDeveloperRepository
  private companyRepository: ICompanyRepository
  private adminRepository: IAdminRepository
  private hrRepository: IHRRepository
  private interviewerRepository: IInterviewerRepository
  private authService: IAuthService
  private blockHistoryRepository: IBlockHistoryRepository
  private cacheService: ICacheService

  constructor(
    @inject("IDeveloperRepository") developerRepository: IDeveloperRepository,
    @inject("ICompanyRepository") companyRepository: ICompanyRepository,
    @inject("IAdminRepository") adminRepository: IAdminRepository,
    @inject("IHRRepository") hrRepository: IHRRepository,
    @inject("IInterviewerRepository") interviewerRepository: IInterviewerRepository,
    @inject("IAuthService") authService: IAuthService,
    @inject("IBlockHistoryRepository") blockHistoryRepository: IBlockHistoryRepository,
    @inject("ICacheService") cacheService: ICacheService,
  ) {
    this.developerRepository = developerRepository
    this.companyRepository = companyRepository
    this.adminRepository = adminRepository
    this.hrRepository = hrRepository
    this.interviewerRepository = interviewerRepository
    this.authService = authService
    this.blockHistoryRepository = blockHistoryRepository
    this.cacheService = cacheService
  }

  async execute(idToken: string, requestedRole: string): Promise<AuthResult> {
    console.log('role', requestedRole)
    
    
    const googleUser = await this.verifyGoogleToken(idToken)
    
    const userInfo = await this.findUserByEmail(googleUser.email, requestedRole)
   
    if (!userInfo) {
      throw new AuthError("User not found. Please register first.")
    }

    const { user, role } = userInfo

    if (role === 'developer' || role === 'company') {
      if (user.isVerified === false) {
        throw new AuthError("Account not verified")
      }
    }

    if (role === 'developer' || role === 'company' || role === 'hr' || role === 'interviewer') {
      if (user.isBlocked) {
        let blockedReason: string | undefined
        let blockedDetails: string | undefined
        
        if (role === 'developer' || role === 'company') {
          const history = await this.blockHistoryRepository.findByEntityId(user.id, role)
          const lastBlocked = history.find(h => h.action === 'blocked')
          blockedReason = lastBlocked?.reason
          blockedDetails = lastBlocked?.details
        } else {
          blockedReason = user.blockedReason || undefined
        }
        
        return { 
          loggedIn: false, 
          isBlocked: true, 
          blockedReason, 
          blockedDetails,
          role 
        }
      }
    }

    const tokens = await this.authService.generateTokens(user.id, role)
    await this.cacheService.set(`refresh:${user.id}`, tokens.refreshToken, 7 * 24 * 60 * 60)
    
    const profileSetup = role === 'developer' ? user.profileSetup : undefined
    
    return { 
      loggedIn: true, 
      ...tokens, 
      profileSetup,
      role 
    }
  }

  private async verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const decoded = this.decodeJWT(idToken)
      
      if (!decoded.email || !decoded.sub) {
        throw new AuthError("Invalid Google token")
      }

      return {
        email: decoded.email,
        name: decoded.name || decoded.given_name + ' ' + decoded.family_name || '',
        picture: decoded.picture,
        sub: decoded.sub
      }
    } catch (error) {
      throw new AuthError("Invalid Google token")
    }
  }

  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8')
      return JSON.parse(jsonPayload)
    } catch (error) {
      throw new Error("Invalid JWT format")
    }
  }

  private async findUserByEmail(email: string, requestedRole: string): Promise<{ user: any, role: string } | null> {
    // Only search in the requested role repository - no fallback search
    switch (requestedRole) {
      case 'developer':
        const developer = await this.developerRepository.findByEmail(email)
        if (developer) return { user: developer, role: 'developer' }
        break
      case 'company':
        const company = await this.companyRepository.findByEmail(email)
        if (company) return { user: company, role: 'company' }
        break
      case 'admin':
        const admin = await this.adminRepository.findByEmail(email)
        if (admin) return { user: admin, role: 'admin' }
        break
      case 'hr':
        const hr = await this.hrRepository.findByUsername(email)
        if (hr) return { user: hr, role: 'hr' }
        break
      case 'interviewer':
        const interviewer = await this.interviewerRepository.findByUsername(email)
        if (interviewer) return { user: interviewer, role: 'interviewer' }
        break
    }
    return null
  }
}
