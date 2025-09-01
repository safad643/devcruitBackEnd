import { Schema, model } from "mongoose"

const companySchema = new Schema(
  {
    fullName: { type: String, required: true },
    businessEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true },
    companyName: { type: String, required: true },
    companyWebsite: { type: String, required: true },
    companySize: { type: String, required: true },
    businessRegistrationNumber: { type: String, required: true },
    businessAddress: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "declined", "resubmitted", "paid"], default: "pending" },
    isBlocked: { type: Boolean, default: false },
    declineReason: { type: String, default: undefined },
    requestedDocuments: { type: [String], default: undefined },
    planName: { type: String, default: undefined },
    expiresAt: { type: Date, default: undefined },
  },
  { timestamps: true },
)

companySchema.index({ businessEmail: 1 }, { unique: true })
companySchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { isVerified: false } },
)

export const CompanyModel = model("Company", companySchema)


