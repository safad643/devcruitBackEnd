import type { FastifyReply, FastifyRequest } from "fastify"
import type { Container } from "inversify"
import type { IAuthService } from "../../application/interfaces/services/IAuthService.ts"

type UserPayload = {
  userId: string
  role: string
}

export interface AuthenticatedRequest extends FastifyRequest {
  user: UserPayload
}

function buildPreHandlers(authService: IAuthService) {
  const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined

    if (!token) {
      return reply.code(401).send({ error: "UNAUTHORIZED", message: "Missing Bearer token" })
    }

    try {
      const payload = await authService.verifyAccessToken(token)
      ;(request as AuthenticatedRequest).user = payload as UserPayload
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
  return buildPreHandlers(authService)
}

export function createAuthPreHandlersFromAuthService(authService: IAuthService) {
  return buildPreHandlers(authService)
}

export type AuthPreHandlers = ReturnType<typeof buildPreHandlers>


