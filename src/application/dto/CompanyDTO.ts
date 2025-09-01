export interface CompanyDTO {
  id: string;
  name: string;
  email: string;
  industry: string;
  size: string;
  description?: string;
  status: 'pending' | 'approved' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHRDTO {
  companyId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface EditHRDTO {
  hrId: string;
  companyId: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface DeleteHRDTO {
  hrId: string;
  companyId: string;
}

export interface BlockHRDTO {
  hrId: string;
  companyId: string;
  reason: string;
}

export interface ListHRDTO {
  companyId: string;
  page: number;
  limit: number;
  search?: string;
}

export interface CreateInterviewerDTO {
  companyId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  expertise: string[];
}

export interface UpdateCompanyPaymentDTO {
  planName: string;
}

export interface CompanyListFilters {
  status?: "pending" | "approved" | "declined" | "resubmitted" | "paid" | "blocked";
  paymentStatus?: "paid" | "unpaid";
  companySize?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
}

export interface CompanyListQuery {
  q?: string;
  page: number;
  pageSize: number;
  sortBy?: "createdAt" | "companyName" | "status";
  sortOrder?: "asc" | "desc";
  filters?: CompanyListFilters;
}
