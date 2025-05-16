import { RefreshToken } from "@prisma/client";

export default interface IRefreshTokenRepository {
  create(data: { userId: string, token: string, expiresAt: Date }): Promise<RefreshToken>;
  create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken>;
  findByUserId(userId: string): Promise<RefreshToken | null>;
  findByToken(token: string): Promise<RefreshToken | null>;
  updateByUserId(userId: string, newToken: string, newExpiresAt: Date): Promise<RefreshToken>;
  deleteByUserId(userId: string): Promise<RefreshToken>;
}
