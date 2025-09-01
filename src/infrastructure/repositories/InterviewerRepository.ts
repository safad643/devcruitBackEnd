import { injectable } from "inversify"
import mongoose from "mongoose"
import { InterviewerModel } from "../database/models/InterviewerModel.ts"
import type { IInterviewerRepository } from "../../domain/repositories/IInterviewerRepository.ts"
import { Interviewer } from "../../domain/entities/Interviewer.ts"

@injectable()
export class InterviewerRepository implements IInterviewerRepository {
  async create(interviewer: Interviewer): Promise<Interviewer> {
    const doc = new InterviewerModel(interviewer)
    await doc.save()
    return interviewer
  }

  async findById(id: string): Promise<Interviewer | null> {
    const interviewer = await InterviewerModel.findById(id)
    if (!interviewer) return null
    return new Interviewer(
      interviewer._id.toString(),
      interviewer.username,
      interviewer.passwordHash,
      interviewer.companyId,
      interviewer.isBlocked,
      interviewer.blockedReason,
      interviewer.createdAt,
      interviewer.updatedAt,
    )
  }

  async findByUsername(username: string): Promise<Interviewer | null> {
    const interviewer = await InterviewerModel.findOne({ username })
    if (!interviewer) return null
    return new Interviewer(
      interviewer._id.toString(),
      interviewer.username,
      interviewer.passwordHash,
      interviewer.companyId,
      interviewer.isBlocked,
      interviewer.blockedReason,
      interviewer.createdAt,
      interviewer.updatedAt,
    )
  }

  async findByCompanyId(companyId: string): Promise<Interviewer[]> {
    const interviewers = await InterviewerModel.find({ companyId })
    return interviewers.map(
      (interviewer) =>
        new Interviewer(
          interviewer._id.toString(),
          interviewer.username,
          interviewer.passwordHash,
          interviewer.companyId,
          interviewer.isBlocked,
          interviewer.blockedReason,
          interviewer.createdAt,
          interviewer.updatedAt,
        ),
    )
  }

  async update(id: string, data: Partial<Interviewer>): Promise<void> {
    await InterviewerModel.findByIdAndUpdate(id, data)
  }

  async delete(id: string): Promise<void> {
    await InterviewerModel.findByIdAndDelete(id)
  }

  async updateBlockStatus(id: string, isBlocked: boolean, reason?: string): Promise<void> {
    await InterviewerModel.findByIdAndUpdate(id, { isBlocked, blockedReason: reason })
  }
}
