export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterCompanyDTO {
  fullName: string;
  businessEmail: string;
  phoneNumber: string;
  companyName: string;
  companyWebsite: string;
  companySize: string;
  businessRegistrationNumber: string;
  businessAddress: string;
  password: string;
}

export interface RegisterDeveloperDTO {
  fullName: string;
  email: string;
  phoneNumber: string;
  currentRole: string;
  location: string;
  yearsOfExperience: number;
  experienceLevel: string;
  preferredWorkStyle: string;
  preferredJobType: string;
  password: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface RequestPasswordResetDTO {
  email: string;
  role: "developer" | "company";
}

export interface ConfirmPasswordResetDTO {
  token: string;
  newPassword: string;
}

export interface VerifyOTPDTO {
  email: string;
  otp: string;
}

export interface ResendOTPDTO {
  email: string;
}

export interface LogoutDTO {
  refreshToken: string;
}

export interface GoogleAuthDTO {
  idToken: string;
  role: "developer" | "company" | "admin" | "hr" | "interviewer";
}


