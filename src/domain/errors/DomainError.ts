export abstract class DomainError extends Error {
  abstract readonly code: string
  abstract readonly statusCode: number
}

export class AuthError extends DomainError {
  readonly code = "AUTH_ERROR"
  readonly statusCode = 401
}

export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR"
  readonly statusCode = 400
}

export class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND"
  readonly statusCode = 404
}

export class ConflictError extends DomainError {
  readonly code = "CONFLICT"
  readonly statusCode = 409
}
