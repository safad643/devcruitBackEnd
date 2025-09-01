import { Schema, model } from "mongoose"

const adminSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true },
})

export const AdminModel = model("Admin", adminSchema)


