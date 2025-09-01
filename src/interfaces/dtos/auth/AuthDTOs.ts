import { z } from "zod";
import { passwordSchema } from "../PasswordSchema";
import {
  LoginDTO,
  RegisterCompanyDTO as RegisterCompanyDTOInterface,
  RegisterDeveloperDTO as RegisterDeveloperDTOInterface,
  RefreshTokenDTO,
  RequestPasswordResetDTO,
  ConfirmPasswordResetDTO,
  VerifyOTPDTO,
  ResendOTPDTO,
  LogoutDTO,
  GoogleAuthDTO
} from "../../../application/dto";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
}).strict() satisfies z.ZodType<LoginDTO>;

export const RegisterCompanySchema = z.object({
  fullName: z.string(),
  businessEmail: z.string().email(),
  phoneNumber: z.string(),
  companyName: z.string(),
  companyWebsite: z.string(),
  companySize: z.string(),
  businessRegistrationNumber: z.string(),
  businessAddress: z.string(),
  password: z.string(),
}).strict() satisfies z.ZodType<RegisterCompanyDTOInterface>;

export const RegisterDeveloperSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  currentRole: z.string(),
  location: z.string(),
  yearsOfExperience: z.number(),
  experienceLevel: z.string(),
  preferredWorkStyle: z.string(),
  preferredJobType: z.string(),
  password: z.string(),
}).strict() satisfies z.ZodType<RegisterDeveloperDTOInterface>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
}).strict() satisfies z.ZodType<RefreshTokenDTO>;

export const RequestPasswordResetSchema = z.object({
  email: z.string().email(),
  role: z.enum(["developer", "company"]),
}).strict() satisfies z.ZodType<RequestPasswordResetDTO>;

export const ConfirmPasswordResetSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
}).strict() satisfies z.ZodType<ConfirmPasswordResetDTO>;

export const VerifyOTPSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
}).strict() satisfies z.ZodType<VerifyOTPDTO>;

export const ResendOTPSchema = z.object({
  email: z.string().email(),
}).strict() satisfies z.ZodType<ResendOTPDTO>;

export const LogoutSchema = z.object({
  refreshToken: z.string(),
}).strict() satisfies z.ZodType<LogoutDTO>;

export const GoogleAuthSchema = z.object({
  idToken: z.string(),
  role: z.enum(["developer", "company", "admin", "hr", "interviewer"]),
}).strict() satisfies z.ZodType<GoogleAuthDTO>;

export function validateLogin(input: unknown): LoginDTO {
  return LoginSchema.parse(input);
}

export function validateRegisterCompany(input: unknown): RegisterCompanyDTOInterface {
  return RegisterCompanySchema.parse(input);
}

export function validateRegisterDeveloper(input: unknown): RegisterDeveloperDTOInterface {
  return RegisterDeveloperSchema.parse(input);
}

export function validateRefreshToken(input: unknown): RefreshTokenDTO {
  return RefreshTokenSchema.parse(input);
}

export function validateRequestPasswordReset(input: unknown): RequestPasswordResetDTO {
  return RequestPasswordResetSchema.parse(input);
}

export function validateConfirmPasswordReset(input: unknown): ConfirmPasswordResetDTO {
  return ConfirmPasswordResetSchema.parse(input);
}

export function validateVerifyOTP(input: unknown): VerifyOTPDTO {
  return VerifyOTPSchema.parse(input);
}

export function validateResendOTP(input: unknown): ResendOTPDTO {
  return ResendOTPSchema.parse(input);
}

export function validateLogout(input: unknown): LogoutDTO {
  return LogoutSchema.parse(input);
}

export function validateGoogleAuth(input: unknown): GoogleAuthDTO {
  return GoogleAuthSchema.parse(input);
}


