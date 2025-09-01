import { z } from "zod";
import {
  CreateHRDTO,
  EditHRDTO,
  DeleteHRDTO,
  BlockHRDTO,
  ListHRDTO,
  CreateInterviewerDTO,
  UpdateCompanyPaymentDTO
} from "../../../application/dto";

export const CreateHRSchema = z.object({
  companyId: z.string(),
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
}) satisfies z.ZodType<CreateHRDTO>;

export const EditHRSchema = z.object({
  hrId: z.string(),
  companyId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.string().optional(),
}) satisfies z.ZodType<EditHRDTO>;

export const DeleteHRSchema = z.object({
  hrId: z.string(),
  companyId: z.string(),
}) satisfies z.ZodType<DeleteHRDTO>;

export const BlockHRSchema = z.object({
  hrId: z.string(),
  companyId: z.string(),
  reason: z.string(),
}) satisfies z.ZodType<BlockHRDTO>;

export const ListHRSchema = z.object({
  companyId: z.string(),
  page: z.number().min(1),
  limit: z.number().min(1).max(100),
  search: z.string().optional(),
}) satisfies z.ZodType<ListHRDTO>;

export const CreateInterviewerSchema = z.object({
  companyId: z.string(),
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  department: z.string(),
  expertise: z.array(z.string()),
}) satisfies z.ZodType<CreateInterviewerDTO>;

export const UpdateCompanyPaymentSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
}) satisfies z.ZodType<UpdateCompanyPaymentDTO>;

export function validateCreateHR(input: unknown): CreateHRDTO {
  return CreateHRSchema.parse(input);
}

export function validateEditHR(input: unknown): EditHRDTO {
  return EditHRSchema.parse(input);
}

export function validateDeleteHR(input: unknown): DeleteHRDTO {
  return DeleteHRSchema.parse(input);
}

export function validateBlockHR(input: unknown): BlockHRDTO {
  return BlockHRSchema.parse(input);
}

export function validateListHR(input: unknown): ListHRDTO {
  return ListHRSchema.parse(input);
}

export function validateCreateInterviewer(input: unknown): CreateInterviewerDTO {
  return CreateInterviewerSchema.parse(input);
}

export function validateUpdateCompanyPayment(input: unknown): UpdateCompanyPaymentDTO {
  return UpdateCompanyPaymentSchema.parse(input);
}
