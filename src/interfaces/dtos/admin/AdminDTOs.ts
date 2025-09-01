import { z } from "zod";
import {
  BlockDeveloperDTO,
  BlockCompanyDTO,
  UnblockDeveloperDTO,
  UnblockCompanyDTO,
  ApproveCompanyDTO,
  DeclineCompanyDTO,
  DeleteDeveloperDTO,
  AddDeveloperWarningDTO,
  MarkWarningAsReadDTO,
  GetEntityBlockHistoryDTO,
  GetEntityWarningsDTO,
  ListCompaniesDTO,
  ListDevelopersDTO
} from "../../../application/dto";

export const BlockDeveloperSchema = z.object({
  developerId: z.string(),
  reason: z.string(),
  adminId: z.string(),
  details: z.string().optional(),
}) satisfies z.ZodType<BlockDeveloperDTO>;

export const BlockCompanySchema = z.object({
  companyId: z.string(),
  reason: z.string().optional(),
  details: z.string().optional(),
}) satisfies z.ZodType<BlockCompanyDTO>;

export const UnblockDeveloperSchema = z.object({
  developerId: z.string(),
  adminId: z.string(),
  reason: z.string(),
  details: z.string().optional(),
}) satisfies z.ZodType<UnblockDeveloperDTO>;

export const UnblockCompanySchema = z.object({
  companyId: z.string(),
  reason: z.string().optional(),
  details: z.string().optional(),
}) satisfies z.ZodType<UnblockCompanyDTO>;

export const ApproveCompanySchema = z.object({
  companyId: z.string(),
}) satisfies z.ZodType<ApproveCompanyDTO>;

export const DeclineCompanySchema = z.object({
  companyId: z.string(),
  reason: z.string(),
  requestedDocuments: z.array(z.string()).optional(),
}) satisfies z.ZodType<DeclineCompanyDTO>;

export const DeleteDeveloperSchema = z.object({
  developerId: z.string(),
  adminId: z.string(),
}) satisfies z.ZodType<DeleteDeveloperDTO>;

export const AddDeveloperWarningSchema = z.object({
  developerId: z.string(),
  reason: z.string(),
  adminId: z.string(),
  details: z.string().optional(),
  expectedResolution: z.string().optional(),
}) satisfies z.ZodType<AddDeveloperWarningDTO>;

export const MarkWarningAsReadSchema = z.object({
  warningId: z.string(),
  adminId: z.string(),
}) satisfies z.ZodType<MarkWarningAsReadDTO>;

export const GetEntityBlockHistorySchema = z.object({
  entityId: z.string(),
  entityType: z.enum(['developer', 'company']),
}) satisfies z.ZodType<GetEntityBlockHistoryDTO>;

export const GetEntityWarningsSchema = z.object({
  entityId: z.string(),
  entityType: z.enum(['developer', 'company']),
  includeRead: z.boolean().optional(),
}) satisfies z.ZodType<GetEntityWarningsDTO>;

export const ListCompaniesSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  search: z.string().optional(),
  status: z.enum(['pending', 'approved', 'blocked']).optional(),
}) satisfies z.ZodType<ListCompaniesDTO>;

export const ListDevelopersSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  search: z.string().optional(),
  status: z.enum(['active', 'blocked']).optional(),
}) satisfies z.ZodType<ListDevelopersDTO>;

export function validateBlockDeveloper(input: unknown): BlockDeveloperDTO {
  return BlockDeveloperSchema.parse(input);
}

export function validateBlockCompany(input: unknown): BlockCompanyDTO {
  return BlockCompanySchema.parse(input);
}

export function validateUnblockDeveloper(input: unknown): UnblockDeveloperDTO {
  return UnblockDeveloperSchema.parse(input);
}

export function validateUnblockCompany(input: unknown): UnblockCompanyDTO {
  return UnblockCompanySchema.parse(input);
}

export function validateApproveCompany(input: unknown): ApproveCompanyDTO {
  return ApproveCompanySchema.parse(input);
}

export function validateDeclineCompany(input: unknown): DeclineCompanyDTO {
  return DeclineCompanySchema.parse(input);
}

export function validateDeleteDeveloper(input: unknown): DeleteDeveloperDTO {
  return DeleteDeveloperSchema.parse(input);
}

export function validateAddDeveloperWarning(input: unknown): AddDeveloperWarningDTO {
  return AddDeveloperWarningSchema.parse(input);
}

export function validateMarkWarningAsRead(input: unknown): MarkWarningAsReadDTO {
  return MarkWarningAsReadSchema.parse(input);
}

export function validateGetEntityBlockHistory(input: unknown): GetEntityBlockHistoryDTO {
  return GetEntityBlockHistorySchema.parse(input);
}

export function validateGetEntityWarnings(input: unknown): GetEntityWarningsDTO {
  return GetEntityWarningsSchema.parse(input);
}

export function validateListCompanies(input: unknown): ListCompaniesDTO {
  return ListCompaniesSchema.parse(input);
}

export function validateListDevelopers(input: unknown): ListDevelopersDTO {
  return ListDevelopersSchema.parse(input);
}
