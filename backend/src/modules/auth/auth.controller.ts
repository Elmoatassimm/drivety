import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import IAuthService from "./interfaces/IAuthService";
import ResponseUtils from "../../core/utils/response.utils";
import { RequestWithUser } from "../../types/types";
import { UnauthorizedError } from "../../core/errors/AppError";

@injectable()
export default class AuthController {
  constructor(
    @inject("IAuthService") private authService: IAuthService,
    @inject("responseUtils") private responseUtils: ResponseUtils
  ) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[AUTH CONTROLLER] Register request received:`, req.body);
    try {
      const { email, password, username } = req.body;
      console.log(`[AUTH CONTROLLER] Calling auth service register with email: ${email}, username: ${username}`);
      const tokens = await this.authService.register(email, password, username);
      console.log(`[AUTH CONTROLLER] Registration successful, sending response`);
      this.responseUtils.sendSuccessResponse(res, tokens, 201);
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Register error:`, error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[AUTH CONTROLLER] Login request received:`, req.body);
    try {
      const { email, password } = req.body;
      console.log(`[AUTH CONTROLLER] Calling auth service login with email: ${email}`);
      const tokens = await this.authService.login(email, password);
      console.log(`[AUTH CONTROLLER] Login successful, sending response`);
      this.responseUtils.sendSuccessResponse(res, tokens);
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Login error:`, error);
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(`[AUTH CONTROLLER] Refresh token request received`);
    try {
      const refreshToken = req.header("x-refresh-token");
      console.log(`[AUTH CONTROLLER] Refresh token present: ${!!refreshToken}`);

      if (!refreshToken) {
        console.log(`[AUTH CONTROLLER] No refresh token provided`);
        throw new UnauthorizedError("Refresh token is required");
      }

      console.log(`[AUTH CONTROLLER] Calling auth service refreshTokens`);
      const tokens = await this.authService.refreshTokens(refreshToken);
      console.log(`[AUTH CONTROLLER] Token refresh successful, sending response`);
      this.responseUtils.sendSuccessResponse(res, tokens);
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Refresh token error:`, error);
      next(error);
    }
  }

  async logout(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    console.log(`[AUTH CONTROLLER] Logout request received`);
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      console.log(`[AUTH CONTROLLER] Authorization token present: ${!!token}`);

      if (!token) {
        console.log(`[AUTH CONTROLLER] No authorization token provided`);
        throw new UnauthorizedError("Authentication token is required");
      }

      console.log(`[AUTH CONTROLLER] Calling auth service logout`);
      await this.authService.logout(token);
      console.log(`[AUTH CONTROLLER] Logout successful, sending response`);
      this.responseUtils.sendSuccessNoDataResponse(res, "Logged out successfully");
    } catch (error) {
      console.error(`[AUTH CONTROLLER] Logout error:`, error);
      next(error);
    }
  }
}
