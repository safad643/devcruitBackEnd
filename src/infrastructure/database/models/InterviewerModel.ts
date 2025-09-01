import { Schema, model } from "mongoose"

const interviewerSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    companyId: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: null },
  },
  { timestamps: true },
)

export const InterviewerModel = model("Interviewer", interviewerSchema)


