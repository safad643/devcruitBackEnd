import type { Admin } from "../entities/Admin.ts"

export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>
  findById(id: string): Promise<Admin | null>
}
