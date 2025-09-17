export interface IEmailService {
  sendOTP(email: string, otp: string): Promise<void>

  sendCompanyApproved(toEmail: string, data: { contactName: string; companyName: string }): Promise<void>
  sendCompanyDeclined(
    toEmail: string,
    data: { contactName: string; companyName: string; reason?: string; requestedDocuments?: string[] },
  ): Promise<void>
  sendCompanyResubmitted(
    toEmail: string,
    data: { contactName: string; companyName: string; resubmissionNotes?: string },
  ): Promise<void>
  sendCompanyBlocked(
    toEmail: string,
    data: { contactName: string; companyName: string; reason?: string; referenceId?: string },
  ): Promise<void>
  sendCompanyUnblocked(
    toEmail: string,
    data: { contactName: string; companyName: string; reason?: string; referenceId?: string },
  ): Promise<void>

  sendDeveloperWarning(
    toEmail: string,
    data: { fullName: string; reason: string; details?: string; expectedResolution?: string; issuedAt?: Date },
  ): Promise<void>
  sendDeveloperBlocked(
    toEmail: string,
    data: { fullName: string; reason: string; details?: string; blockId?: string },
  ): Promise<void>
  sendDeveloperTerminated(
    toEmail: string,
    data: { fullName: string; reason?: string; caseId?: string },
  ): Promise<void>
}
