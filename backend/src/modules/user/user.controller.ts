import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { BaseController } from "../../core/base/BaseController";
import { UserService } from "./user.service";
import ResponseUtils from "../../core/utils/response.utils";
import { IUser } from "./interfaces/IUserRepository";

@injectable()
export class UserController extends BaseController<IUser> {
  constructor(
    @inject("UserService") private userService: UserService,
    @inject("responseUtils") responseUtils: ResponseUtils
  ) {
    super(userService, responseUtils);
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id || (req as any).user?.id;
      const profile = await this.userService.getProfile(id);
      this.responseUtils.sendSuccessResponse(res, profile);
    } catch (error) {
      next(error);
    }
  }

  // Other controller methods...
}
