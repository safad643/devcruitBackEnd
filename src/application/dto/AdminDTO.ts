export interface AdminDTO {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockDeveloperDTO {
  developerId: string;
  reason: string;
  adminId: string;
  details?: string;
}

export interface BlockCompanyDTO {
  companyId: string;
  reason?: string;
  details?: string;
}

export interface UnblockDeveloperDTO {
  developerId: string;
  adminId: string;
  reason: string;
  details?: string;
}

export interface UnblockCompanyDTO {
  companyId: string;
  reason?: string;
  details?: string;
}

export interface ApproveCompanyDTO {
  companyId: string;
}

export interface DeclineCompanyDTO {
  companyId: string;
  reason: string;
  requestedDocuments?: string[];
}

export interface DeleteDeveloperDTO {
  developerId: string;
  adminId: string;
}

export interface AddDeveloperWarningDTO {
  developerId: string;
  reason: string;
  adminId: string;
  details?: string;
  expectedResolution?: string;
}

export interface MarkWarningAsReadDTO {
  warningId: string;
  adminId: string;
}

export interface GetEntityBlockHistoryDTO {
  entityId: string;
  entityType: 'developer' | 'company';
}

export interface GetEntityWarningsDTO {
  entityId: string;
  entityType: 'developer' | 'company';
  includeRead?: boolean;
}

export interface ListCompaniesDTO {
  page: number;
  limit: number;
  search?: string;
  status?: 'pending' | 'approved' | 'blocked';
}

export interface ListDevelopersDTO {
  page: number;
  limit: number;
  search?: string;
  status?: 'active' | 'blocked';
}
