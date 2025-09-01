import { inject, injectable } from "inversify"
import type { IDeveloperRepository } from "../../../domain/repositories/IDeveloperRepository.ts"
import type { IFileUploadService, UploadKind } from "../../interfaces/services/IFileUploadService.ts"
import type { DeveloperProfileCreateInput } from "../../dto"
import { ValidationError } from "../../../domain/errors/DomainError.ts"

@injectable()
export class CreateDeveloperProfileUseCase {
  constructor(
    @inject("IDeveloperRepository") private readonly developerRepository: IDeveloperRepository,
    @inject("FileUploadService") private readonly uploadService: IFileUploadService,
  ) {}

  async execute(developerId: string, input: DeveloperProfileCreateInput): Promise<void> {
    const dev = await this.developerRepository.findById(developerId)
    if (!dev) throw new ValidationError("Developer not found")

    const updates: Record<string, unknown> = {}

    if (input.files.profilePhoto && input.files.profilePhoto.buffer) {
      const url = await this.uploadService.upload(
        "developer",
        developerId,
        "profile",
        input.files.profilePhoto.originalname,
        input.files.profilePhoto.buffer,
        { contentType: input.files.profilePhoto.mimetype },
      )
      updates.profilePhotoUrl = url
    }

    if (input.files.cvFile && input.files.cvFile.buffer) {
      const url = await this.uploadService.upload(
        "developer",
        developerId,
        "cv",
        input.files.cvFile.originalname,
        input.files.cvFile.buffer,
        { contentType: input.files.cvFile.mimetype },
      )
      updates.cvUrl = url
    }

    const education = Array.isArray(input.education) ? [...input.education] : []
    if (Array.isArray(input.files.educationCertificates)) {
      for (const { index, certificate } of input.files.educationCertificates) {
        if (!education[index]) continue
        if (certificate && certificate.buffer) {
          const url = await this.uploadService.upload(
            "developer",
            developerId,
            "certificate",
            certificate.originalname,
            certificate.buffer,
            { contentType: certificate.mimetype },
          )
          education[index] = { ...education[index], certificateUrl: url }
        }
      }
    }

    Object.assign(updates, {
      bio: input.bio,
      githubUrl: input.githubUrl,
      portfolioUrl: input.portfolioUrl,
      isFresher: input.isFresher,
      isSelfLearned: input.isSelfLearned,
      techStack: input.techStack,
      softSkills: input.softSkills,
      workExperience: input.workExperience,
      education,
      projects: input.projects,
      profileSetup: true,
    })

    await this.developerRepository.updateById(developerId, updates )      
  }
}


