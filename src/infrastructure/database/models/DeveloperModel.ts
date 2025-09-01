import { Schema, model } from "mongoose"

const developerSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, required: true },
    currentRole: { type: String, required: true },
    location: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    experienceLevel: { type: String, required: true },
    preferredWorkStyle: { type: String, required: true },
    preferredJobType: { type: String, required: true },
    skills: [{ type: String }],
    bio: { type: String },
    githubUrl: { type: String },
    portfolioUrl: { type: String },
    isFresher: { type: Boolean },
    isSelfLearned: { type: Boolean },
    techStack: [{ type: String }],
    softSkills: [{ type: String }],
    workExperience: [
      {
        jobTitle: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: String, required: true },
        endDate: { type: String },
        responsibilities: { type: String, required: true },
        achievements: { type: String },
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        year: { type: String, required: true },
        certificateName: { type: String },
        certificateUrl: { type: String },
      },
    ],
    projects: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        technologies: { type: String, required: true },
        liveUrl: { type: String },
        repoUrl: { type: String },
      },
    ],
    profilePhotoUrl: { type: String },
    cvUrl: { type: String },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    profileSetup: { type: Boolean, default: false },
    expiresAt: { type: Date, default: undefined },
  },
  { timestamps: true },
)

developerSchema.index({ email: 1 }, { unique: true })
developerSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { isVerified: false } },
)

export const DeveloperModel = model("Developer", developerSchema)


