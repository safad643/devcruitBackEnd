export type UploadOptions = { contentType?: string }

export type UploadKind = "profile" | "cv" | "certificate"
export type UploadUserRole = "developer" | "company" | "admin" | "hr" | "interviewer"

export interface IFileUploadService {
  upload(
    user: UploadUserRole,
    userId: string,
    kind: UploadKind,
    fileName: string,
    data: Buffer,
    options?: UploadOptions,
  ): Promise<string>
}


