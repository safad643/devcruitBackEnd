export interface IAuthService {
  hashPassword(password: string): Promise<string>
  comparePassword(password: string, hash: string): Promise<boolean>
  generateTokens(userId: string, role: string): Promise<{ accessToken: string; refreshToken: string }>
  verifyAccessToken(token: string): Promise<{ userId: string; role: string }>
  verifyRefreshToken(token: string): Promise<{ userId: string; role: string }>
  issueAccessToken(userId: string, role: string): Promise<string>
}
