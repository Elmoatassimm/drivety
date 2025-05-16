import { PrismaClient, RefreshToken } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import IRefreshTokenRepository from "./interfaces/IRefreshTokenRepository";
import PrismaService from "../../config/db";
import { BaseRepository } from "../../core/base/BaseRepository";

@injectable()
export default class RefreshTokenRepository extends BaseRepository<RefreshToken> implements IRefreshTokenRepository {
  protected modelName = "refreshToken";

  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
  }

  // Override the create method from BaseRepository to match our specific needs
  async create(data: { userId: string, token: string, expiresAt: Date }): Promise<RefreshToken>;
  async create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken>;
  async create(
    dataOrUserId: { userId: string, token: string, expiresAt: Date } | string,
    token?: string,
    expiresAt?: Date
  ): Promise<RefreshToken> {
    try {
      let userId: string;
      let tokenValue: string;
      let expiresAtValue: Date;

      if (typeof dataOrUserId === 'string') {
        userId = dataOrUserId;
        tokenValue = token!;
        expiresAtValue = expiresAt!;
      } else {
        userId = dataOrUserId.userId;
        tokenValue = dataOrUserId.token;
        expiresAtValue = dataOrUserId.expiresAt;
      }

      // First try to find an existing token
      const existingToken = await this.prisma.refreshToken.findFirst({
        where: { userId },
      });

      if (existingToken) {
        // Update if exists
        return this.prisma.refreshToken.update({
          where: { id: existingToken.id },
          data: {
            token: tokenValue,
            expiresAt: expiresAtValue,
          },
        });
      } else {
        // Create if doesn't exist
        return this.prisma.refreshToken.create({
          data: {
            userId,
            token: tokenValue,
            expiresAt: expiresAtValue,
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    try {
      return this.prisma.refreshToken.findFirst({
        where: { userId },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    try {
      return this.prisma.refreshToken.findFirst({
        where: { token },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateByUserId(userId: string, newToken: string, newExpiresAt: Date): Promise<RefreshToken> {
    try {
      const existingToken = await this.prisma.refreshToken.findFirst({
        where: { userId },
      });

      if (!existingToken) {
        throw new Error(`No refresh token found for user ${userId}`);
      }

      return this.prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: {
          token: newToken,
          expiresAt: newExpiresAt,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteByUserId(userId: string): Promise<RefreshToken> {
    try {
      const existingToken = await this.prisma.refreshToken.findFirst({
        where: { userId },
      });

      if (!existingToken) {
        throw new Error(`No refresh token found for user ${userId}`);
      }

      return this.prisma.refreshToken.delete({
        where: { id: existingToken.id },
      });
    } catch (error) {
      throw error;
    }
  }
}
