export interface DeveloperDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  skills: string[];
  experience: number;
  education: string;
  status: 'active' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeveloperProfileDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  skills: string[];
  experience: number;
  education: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface DeveloperProfileCreateInput {
  bio?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  isFresher: boolean;
  isSelfLearned: boolean;
  techStack: string[];
  softSkills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  files: DeveloperProfileFiles;
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  startDate: string;
  endDate?: string;
  responsibilities: string;
  achievements?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  certificateName?: string;
  certificateUrl?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface DeveloperProfileFiles {
  profilePhoto?: UploadedFile;
  cvFile?: UploadedFile;
  educationCertificates?: Array<{
    index: number;
    certificate: UploadedFile;
  }>;
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  size?: number;
  path?: string;
  buffer?: Buffer;
}

export interface DeveloperListFilters {
  status?: "active" | "pending" | "blocked";
  experienceLevel?: string;
  preferredWorkStyle?: string;
  preferredJobType?: string;
  location?: string;
  skills?: string[];
  minYears?: number;
  maxYears?: number;
  isVerified?: boolean;
  isBlocked?: boolean;
}

export interface DeveloperListQuery {
  q?: string;
  page: number;
  pageSize: number;
  sortBy?: "createdAt" | "fullName" | "experienceLevel";
  sortOrder?: "asc" | "desc";
  filters?: DeveloperListFilters;
}
