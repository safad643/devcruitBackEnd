import { z } from "zod";
import type { DeveloperProfileCreateInput, UploadedFile } from "../../../application/dto";
import { CreateDeveloperProfileDTO } from "../../../application/dto";

export const CreateDeveloperProfileSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  skills: z.array(z.string()),
  experience: z.number(),
  education: z.string(),
  portfolio: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
}) satisfies z.ZodType<CreateDeveloperProfileDTO>;

export function validateCreateDeveloperProfile(input: unknown): CreateDeveloperProfileDTO {
  return CreateDeveloperProfileSchema.parse(input);
}

export type { UploadedFile } from "../../../application/dto";

export function parseDeveloperProfileInput(
  fields: Record<string, any>,
  files: Record<string, UploadedFile | undefined>,
): DeveloperProfileCreateInput {
  const toBool = (v: unknown): boolean => v === true || v === "true";
  const toStringArray = (v: unknown): string[] =>
    Array.isArray(v) ? v.map(String) : typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const parseJsonArray = <T = any>(v: unknown): T[] => {
    if (Array.isArray(v)) return v as T[];
    if (typeof v === "string") {
      try { const p = JSON.parse(v); return Array.isArray(p) ? p : []; } catch { return []; }
    }
    return [];
  };

  return {
    bio: typeof fields.bio === "string" ? fields.bio : undefined,
    githubUrl: typeof fields.githubUrl === "string" ? fields.githubUrl : undefined,
    portfolioUrl: typeof fields.portfolioUrl === "string" ? fields.portfolioUrl : undefined,
    isFresher: toBool(fields.isFresher),
    isSelfLearned: toBool(fields.isSelfLearned),
    techStack: toStringArray(fields.techStack),
    softSkills: toStringArray(fields.softSkills),
    workExperience: parseJsonArray(fields.workExperience),
    education: parseJsonArray(fields.education),
    projects: parseJsonArray(fields.projects),
    files: {
      profilePhoto: files.profilePhoto,
      cvFile: files.cvFile,
      educationCertificates: Array.isArray(files.educationCertificates)
        ? (files.educationCertificates as any)
        : undefined,
    },
  };
}
