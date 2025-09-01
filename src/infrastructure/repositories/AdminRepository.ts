import { injectable } from "inversify"
import { AdminModel } from "../database/models/AdminModel.ts"
import type { IAdminRepository } from "../../domain/repositories/IAdminRepository.ts"
import { Admin } from "../../domain/entities/Admin.ts"

@injectable()
export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await AdminModel.findOne({ email })
    if (!admin) return null
    return new Admin(admin._id.toString(), admin.fullName, admin.email, admin.passwordHash, admin.role)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await AdminModel.findById(id)
    if (!admin) return null
    return new Admin(admin._id.toString(), admin.fullName, admin.email, admin.passwordHash, admin.role)
  }
}
