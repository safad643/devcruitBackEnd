import type { FastifyReply, FastifyRequest } from "fastify"
import type { Container } from "inversify"
import type { IAuthService } from "../../application/interfaces/services/IAuthService.ts"
import type { ICompanyRepository } from "../../domain/repositories/ICompanyRepository.ts"
import type { IDeveloperRepository } from "../../domain/repositories/IDeveloperRepository.ts"
import type { IHRRepository } from "../../domain/repositories/IHRRepository.ts"
import type { IInterviewerRepository } from "../../domain/repositories/IInterviewerRepository.ts"
import type { IBlockHistoryRepository } from "../../domain/repositories/IBlockHistoryRepository.ts"

type UserPayload = {
  userId: string
  role: string
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: UserPayload
}

function buildPreHandlers(
  authService: IAuthService,
  companyRepository: ICompanyRepository,
  developerRepository: IDeveloperRepository,
  hrRepository: IHRRepository,
  interviewerRepository: IInterviewerRepository,
  blockHistoryRepository: IBlockHistoryRepository
) {
  const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined

    if (!token) {
      return reply.code(401).send({ error: "UNAUTHORIZED", message: "Missing Bearer token" })
    }

    try {
      const payload = await authService.verifyAccessToken(token)
      ;(request as AuthenticatedRequest).user = payload as UserPayload
      
      // Check if user is blocked
      const { userId, role } = payload
      let isBlocked = false
      let blockedReason = ""
      let blockedDetails = ""

      switch (role) {
        case "company":
          const company = await companyRepository.findById(userId)
          if (company?.isBlocked) {
            isBlocked = true
            const history = await blockHistoryRepository.findByEntityId(userId, 'company')
            const lastBlocked = history.find(h => h.action === 'blocked')
            blockedReason = lastBlocked?.reason || "Account blocked"
            blockedDetails = lastBlocked?.details || ""
          }
          break
        case "developer":
          const developer = await developerRepository.findById(userId)
          if (developer?.isBlocked) {
            isBlocked = true
            const history = await blockHistoryRepository.findByEntityId(userId, 'developer')
            const lastBlocked = history.find(h => h.action === 'blocked')
            blockedReason = lastBlocked?.reason || "Account blocked"
            blockedDetails = lastBlocked?.details || ""
          }
          break
        case "hr":
          const hr = await hrRepository.findById(userId)
          if (hr?.isBlocked) {
            isBlocked = true
            const history = await blockHistoryRepository.findByEntityId(userId, 'hr')
            const lastBlocked = history.find(h => h.action === 'blocked')
            blockedReason = lastBlocked?.reason || "Account blocked"
            blockedDetails = lastBlocked?.details || ""
          }
          break
        case "interviewer":
          const interviewer = await interviewerRepository.findById(userId)
          if (interviewer?.isBlocked) {
            isBlocked = true
            const history = await blockHistoryRepository.findByEntityId(userId, 'interviewer')
            const lastBlocked = history.find(h => h.action === 'blocked')
            blockedReason = lastBlocked?.reason || "Account blocked"
            blockedDetails = lastBlocked?.details || ""
          }
          break
      }

      if (isBlocked) {
        return reply.code(403).send({ 
          error: "ACCOUNT_BLOCKED", 
          message: "Your account has been blocked",
          blockedReason,
          blockedDetails
        })
      }
    } catch {
      return reply.code(401).send({ error: "UNAUTHORIZED", message: "Invalid or expired token" })
    }
  }

  const requireRole = (...allowedRoles: string[]) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      await requireAuth(request, reply)
      if (reply.sent) return
      const user = (request as AuthenticatedRequest).user as UserPayload | undefined
      if (!user || !allowedRoles.includes(user.role)) {
        return reply.code(403).send({ error: "FORBIDDEN", message: "Insufficient permissions" })
      }
    }
  }

  return { requireAuth, requireRole }
}

export function createAuthPreHandlers(container: Container) {
  const authService = container.get<IAuthService>("IAuthService")
  const companyRepository = container.get<ICompanyRepository>("ICompanyRepository")
  const developerRepository = container.get<IDeveloperRepository>("IDeveloperRepository")
  const hrRepository = container.get<IHRRepository>("IHRRepository")
  const interviewerRepository = container.get<IInterviewerRepository>("IInterviewerRepository")
  const blockHistoryRepository = container.get<IBlockHistoryRepository>("IBlockHistoryRepository")
  
  return buildPreHandlers(
    authService,
    companyRepository,
    developerRepository,
    hrRepository,
    interviewerRepository,
    blockHistoryRepository
  )
}

export function createAuthPreHandlersFromAuthService(
  authService: IAuthService,
  companyRepository: ICompanyRepository,
  developerRepository: IDeveloperRepository,
  hrRepository: IHRRepository,
  interviewerRepository: IInterviewerRepository,
  blockHistoryRepository: IBlockHistoryRepository
) {
  return buildPreHandlers(
    authService,
    companyRepository,
    developerRepository,
    hrRepository,
    interviewerRepository,
    blockHistoryRepository
  )
}

export type AuthPreHandlers = ReturnType<typeof buildPreHandlers>


