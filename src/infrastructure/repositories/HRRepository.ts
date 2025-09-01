import { injectable } from "inversify"
import mongoose from "mongoose"
import { HRModel } from "../database/models/HRModel.ts"
import type { IHRRepository } from "../../domain/repositories/IHRRepository.ts"
import { HR } from "../../domain/entities/HR.ts"

@injectable()
export class HRRepository implements IHRRepository {
  async create(hr: HR): Promise<HR> {
    const doc = new HRModel(hr)
    await doc.save()
    return hr
  }

  async findById(id: string): Promise<HR | null> {
    const hr = await HRModel.findById(id)
    if (!hr) return null
    return new HR(
      hr._id.toString(),
      hr.username,
      hr.passwordHash,
      hr.companyId,
      hr.isBlocked,
      hr.blockedReason,
      hr.createdAt,
      hr.updatedAt,
    )
  }

  async findByUsername(username: string): Promise<HR | null> {
    const hr = await HRModel.findOne({ username })
    if (!hr) return null
    return new HR(
      hr._id.toString(),
      hr.username,
      hr.passwordHash,
      hr.companyId,
      hr.isBlocked,
      hr.blockedReason,
      hr.createdAt,
      hr.updatedAt,
    )
  }

  async findByCompanyId(companyId: string): Promise<HR[]> {
    const hrs = await HRModel.find({ companyId })
    return hrs.map(
      (hr) =>
        new HR(
          hr._id.toString(),
          hr.username,
          hr.passwordHash,
          hr.companyId,
          hr.isBlocked,
          hr.blockedReason,
          hr.createdAt,
          hr.updatedAt,
        ),
    )
  }

  async update(id: string, data: Partial<HR>): Promise<void> {
    await HRModel.findByIdAndUpdate(id, data)
  }

  async delete(id: string): Promise<void> {
    await HRModel.findByIdAndDelete(id)
  }

  async updateBlockStatus(id: string, isBlocked: boolean, reason?: string): Promise<void> {
    await HRModel.findByIdAndUpdate(id, { isBlocked, blockedReason: reason })
  }
}
