import { z } from "zod";
import { PasswordPolicyDTO } from "../../application/dto";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must include at least one number" })
  .regex(/[^A-Za-z0-9]/, { message: "Password must include at least one special character" });

export const passwordPolicy: PasswordPolicyDTO = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
};

export function validatePassword(input: unknown): string {
  return passwordSchema.parse(input);
}


