import { inject, injectable } from "inversify"
import type { IInterviewerRepository } from "../../../domain/repositories/IInterviewerRepository.ts"
import type { IAuthService } from "../../interfaces/services/IAuthService.ts"
import { Interviewer } from "../../../domain/entities/Interviewer.ts"
import { ConflictError } from "../../../domain/errors/DomainError.ts"
import { randomUUID } from "crypto"

@injectable()
export class CreateInterviewerUseCase {
  private interviewerRepository: IInterviewerRepository
  private authService: IAuthService

  constructor(
    @inject("IInterviewerRepository") interviewerRepository: IInterviewerRepository,
    @inject("IAuthService") authService: IAuthService,
  ) {
    this.interviewerRepository = interviewerRepository
    this.authService = authService
  }

  async execute(companyId: string, username: string, password: string): Promise<Interviewer> {
    const existingInterviewer = await this.interviewerRepository.findByUsername(username)
    if (existingInterviewer) {
      throw new ConflictError("Interviewer username already exists")
    }

    const passwordHash = await this.authService.hashPassword(password)
    const interviewer = new Interviewer(randomUUID(), username, passwordHash, companyId)

    return this.interviewerRepository.create(interviewer)
  }
}
