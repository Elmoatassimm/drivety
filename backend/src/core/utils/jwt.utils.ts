import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
// Define a type for string values that can be used in expiresIn
type StringOrNumber = string | number;
import { injectable, singleton } from "tsyringe";
import { UnauthorizedError } from "../errors/AppError";

@singleton()
@injectable()
export default class JwtUtils {
  private readonly JWT_SECRET: string = process.env.JWT_SECRET ?? "your-secret-key";
  private readonly JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || "1d";
  private readonly REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET ?? "your-refresh-secret";
  private readonly REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY || "15d";

  generateAccessToken(
    userId: string,
    email: string,
    username: string,
    role: string
  ): string {
    const options = { expiresIn: this.JWT_EXPIRATION as any };
    return jwt.sign(
      { userId, email, username, role },
      String(this.JWT_SECRET),
      options
    );
  }

  generateRefreshToken(userId: string, email: string): string {
    const options = { expiresIn: this.REFRESH_TOKEN_EXPIRY as any };
    return jwt.sign(
      { userId, email },
      String(this.REFRESH_TOKEN_SECRET),
      options
    );
  }

  verifyAccessToken(token: string): { userId: string; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, String(this.JWT_SECRET)) as {
        userId: string;
        email: string;
        role: string;
        iat: number;
        exp: number;
      };
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    } catch {
      return null;
    }
  }

  verifyRefreshToken(token: string): boolean {
    try {
      jwt.verify(token, String(this.REFRESH_TOKEN_SECRET));
      return true;
    } catch {
      return false;
    }
  }

  getUserIdFromToken(token: string): string {
    try {
      const decoded = jwt.verify(token, String(this.JWT_SECRET)) as {
        userId: string;
        email: string;
        username: string;
      };
      return decoded.userId;
    } catch (error) {
      throw new UnauthorizedError("Invalid token");
    }
  }

  getUserFromToken(token: string) {
    try {
      const decoded = jwt.verify(token, String(this.JWT_SECRET)) as {
        userId: string;
        email: string;
        username: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw new UnauthorizedError("Invalid token");
    }
  }

  getUserFromRefreshToken(token: string): string {
    try {
      const decoded = jwt.verify(token, String(this.REFRESH_TOKEN_SECRET)) as {
        userId: string;
        email: string;
      };
      return decoded.userId;
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }
  }
}
