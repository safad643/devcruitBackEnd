export type DeveloperWorkExperience = {
  jobTitle: string
  company: string
  startDate: string
  endDate?: string
  responsibilities: string
  achievements?: string
}

export type DeveloperEducation = {
  degree: string
  institution: string
  year: string
  certificateName?: string
  certificateUrl?: string
}

export type DeveloperProject = {
  name: string
  description: string
  technologies: string
  liveUrl?: string
  repoUrl?: string
}

export class Developer {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly currentRole: string,
    public readonly location: string,
    public readonly yearsOfExperience: number,
    public readonly experienceLevel: string,
    public readonly preferredWorkStyle: string,
    public readonly preferredJobType: string,
    public readonly skills: string[],
    public readonly passwordHash: string,
    public readonly bio?: string,
    public readonly githubUrl?: string,
    public readonly portfolioUrl?: string,
    public readonly isFresher?: boolean,
    public readonly isSelfLearned?: boolean,
    public readonly techStack?: string[],
    public readonly softSkills?: string[],
    public readonly workExperience?: DeveloperWorkExperience[],
    public readonly education?: DeveloperEducation[],
    public readonly projects?: DeveloperProject[],
    public readonly profilePhotoUrl?: string,
    public readonly cvUrl?: string,
    public readonly isVerified: boolean = false,
    public readonly isBlocked: boolean = false,
    public readonly profileSetup: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}
}
