export class Company {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly businessEmail: string,
    public readonly phoneNumber: string,
    public readonly companyName: string,
    public readonly companyWebsite: string,
    public readonly companySize: string,
    public readonly businessRegistrationNumber: string,
    public readonly businessAddress: string,
    public readonly passwordHash: string,
    public readonly isVerified: boolean = false,
    public readonly status: "pending" | "approved" | "declined" | "resubmitted" | "paid" = "pending",
    public readonly isBlocked: boolean = false,
    public readonly declineReason?: string,
    public readonly requestedDocuments?: string[],
    public readonly planName?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  getFrontendStatus(): 'pending' | 'approved' | 'rejected' | 'paid' | 'settled' {
    switch (this.status) {
      case 'pending':
        return 'pending'
      case 'approved':
        return 'approved'
      case 'declined':
        return 'rejected'
      case 'paid':
        return 'settled'  // Map paid status to settled for frontend
      case 'resubmitted':
        return 'pending'
      default:
        return 'pending'
    }
  }

  static fromFrontendStatus(frontendStatus: 'pending' | 'approved' | 'rejected' | 'paid'): "pending" | "approved" | "declined" | "resubmitted" | "paid" {
    switch (frontendStatus) {
      case 'pending':
        return 'pending'
      case 'approved':
        return 'approved'
      case 'rejected':
        return 'declined'
      case 'paid':
        return 'paid'
      default:
        return 'pending'
    }
  }
}
