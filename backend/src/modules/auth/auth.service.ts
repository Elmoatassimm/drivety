import { inject, injectable } from "tsyringe";
import bcrypt from "bcryptjs";
import IAuthService from "./interfaces/IAuthService";
import IUserRepository from "../user/interfaces/IUserRepository";
import IRefreshTokenRepository from "./interfaces/IRefreshTokenRepository";
import { UserRole } from "../../types/user.types";
import JwtUtils from "../../core/utils/jwt.utils";
import { TAuthToken } from "../../types/types";
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
  UnauthorizedError,
} from "../../core/errors/AppError";

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IRefreshTokenRepository") private refreshTokenRepository: IRefreshTokenRepository,
    @inject("jwt") private jwt: JwtUtils,
  ) {}

  async register(email: string, password: string, username: string, role: UserRole = UserRole.DRIVER): Promise<TAuthToken> {
    console.log(`[AUTH SERVICE] Register attempt for email: ${email}, username: ${username}, role: ${role}`);
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      console.log(`[AUTH SERVICE] Existing user check: ${existingUser ? 'User exists' : 'User does not exist'}`);

      if (existingUser) throw new ConflictError("User already exists");

      console.log(`[AUTH SERVICE] Hashing password...`);
      const password_hash = await bcrypt.hash(password, 10);
      console.log(`[AUTH SERVICE] Password hashed successfully`);

      console.log(`[AUTH SERVICE] Creating user in database...`);
      const user = await this.userRepository.createUser({
        email,
        password_hash,
        username,
        role
      });
      console.log(`[AUTH SERVICE] User created successfully with ID: ${user.id}`);

      console.log(`[AUTH SERVICE] Generating tokens...`);
      const accessToken = this.jwt.generateAccessToken(
        user.id,
        user.email,
        user.username || 'user',
        user.role
      );
      const refreshToken = this.jwt.generateRefreshToken(user.id, user.email);
      console.log(`[AUTH SERVICE] Tokens generated successfully`);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 15);

      console.log(`[AUTH SERVICE] Storing refresh token in database...`);
      await this.refreshTokenRepository.create(
        user.id,
        refreshToken,
        expiresAt,
      );
      console.log(`[AUTH SERVICE] Refresh token stored successfully`);

      return { accessToken, refreshToken };
    } catch (error: any) {
      console.error(`[AUTH SERVICE] Registration error:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
        console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
        console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
      }
      if (error instanceof ConflictError) throw error;
      throw new InternalServerError("Failed to register user");
    }
  }

  async login(email: string, password: string): Promise<TAuthToken> {
    console.log(`[AUTH SERVICE] Login attempt for email: ${email}`);
    try {
      console.log(`[AUTH SERVICE] Finding user by email...`);
      const user = await this.userRepository.findByEmail(email);
      console.log(`[AUTH SERVICE] User found: ${user ? 'Yes' : 'No'}`);

      if (!user) throw new NotFoundError("User");

      console.log(`[AUTH SERVICE] Validating password...`);
      console.log(`[AUTH SERVICE] User has password_hash: ${!!user.password_hash}, password: ${!!user.password}`);
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash || user.password,
      );
      console.log(`[AUTH SERVICE] Password validation result: ${isPasswordValid ? 'Valid' : 'Invalid'}`);

      if (!isPasswordValid) throw new UnauthorizedError("Invalid credentials");

      console.log(`[AUTH SERVICE] Generating tokens...`);
      const accessToken = this.jwt.generateAccessToken(
        user.id,
        user.email,
        user.username || 'user',
        user.role
      );
      const refreshToken = this.jwt.generateRefreshToken(user.id, user.email);
      console.log(`[AUTH SERVICE] Tokens generated successfully`);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 15);

      console.log(`[AUTH SERVICE] Storing refresh token in database...`);
      await this.refreshTokenRepository.create(
        user.id,
        refreshToken,
        expiresAt,
      );
      console.log(`[AUTH SERVICE] Refresh token stored successfully`);

      return { accessToken, refreshToken };
    } catch (error: any) {
      console.error(`[AUTH SERVICE] Login error:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
        console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
        console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
      }
      if (
        error instanceof NotFoundError ||
        error instanceof UnauthorizedError
      ) {
        throw error;
      }
      throw new InternalServerError("Failed to login");
    }
  }

  async refreshTokens(refreshToken: string): Promise<TAuthToken> {
    console.log(`[AUTH SERVICE] Refresh token attempt`);
    try {
      console.log(`[AUTH SERVICE] Verifying refresh token...`);
      const userId = this.jwt.getUserFromRefreshToken(refreshToken);
      console.log(`[AUTH SERVICE] Token verified, user ID: ${userId}`);

      console.log(`[AUTH SERVICE] Finding stored refresh token...`);
      const storedRefreshToken =
        await this.refreshTokenRepository.findByUserId(userId);
      console.log(`[AUTH SERVICE] Stored token found: ${storedRefreshToken ? 'Yes' : 'No'}`);

      if (
        !storedRefreshToken ||
        storedRefreshToken.token !== refreshToken ||
        storedRefreshToken.expiresAt < new Date()
      ) {
        console.log(`[AUTH SERVICE] Token validation failed:
          - Token exists: ${!!storedRefreshToken}
          - Token matches: ${storedRefreshToken ? storedRefreshToken.token === refreshToken : false}
          - Not expired: ${storedRefreshToken ? storedRefreshToken.expiresAt >= new Date() : false}
        `);
        throw new UnauthorizedError("Invalid refresh token");
      }

      console.log(`[AUTH SERVICE] Finding user...`);
      const user = await this.userRepository.findById(userId);
      console.log(`[AUTH SERVICE] User found: ${user ? 'Yes' : 'No'}`);

      if (!user) throw new NotFoundError("User");

      console.log(`[AUTH SERVICE] Generating new tokens...`);
      const newAccessToken = this.jwt.generateAccessToken(
        user.id,
        user.email,
        user.username || 'user',
        user.role || 'user',
      );
      const newRefreshToken = this.jwt.generateRefreshToken(
        user.id,
        user.email,
      );
      console.log(`[AUTH SERVICE] New tokens generated successfully`);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 15);

      console.log(`[AUTH SERVICE] Updating refresh token in database...`);
      await this.refreshTokenRepository.updateByUserId(
        user.id,
        newRefreshToken,
        expiresAt,
      );
      console.log(`[AUTH SERVICE] Refresh token updated successfully`);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error: any) {
      console.error(`[AUTH SERVICE] Refresh token error:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
        console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
        console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
      }
      if (
        error instanceof UnauthorizedError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }
      throw new InternalServerError("Failed to refresh tokens");
    }
  }

  async logout(token: string): Promise<void> {
    console.log(`[AUTH SERVICE] Logout attempt`);
    try {
      console.log(`[AUTH SERVICE] Getting user ID from token...`);
      const userId = this.jwt.getUserIdFromToken(token);
      console.log(`[AUTH SERVICE] User ID from token: ${userId}`);

      console.log(`[AUTH SERVICE] Deleting refresh token from database...`);
      await this.refreshTokenRepository.deleteByUserId(userId);
      console.log(`[AUTH SERVICE] Refresh token deleted successfully`);
    } catch (error: any) {
      console.error(`[AUTH SERVICE] Logout error:`, error);
      // If it's a Prisma error, log more details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error(`[AUTH SERVICE] Prisma error code: ${error.code}`);
        console.error(`[AUTH SERVICE] Prisma error message: ${error.message}`);
        console.error(`[AUTH SERVICE] Prisma error meta:`, error.meta);
      }
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new InternalServerError("Failed to logout");
    }
  }
}
