import { Request, Response, NextFunction } from "express";
import { container } from "../../config/container";
import ResponseUtils from "../utils/response.utils";
import JwtUtils from "../utils/jwt.utils";
import { RequestWithUser } from "../../types/types";
import { UnauthorizedError } from "../errors/AppError";

export default async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new UnauthorizedError("Authentication token is required");
    }

    const jwt = container.resolve(JwtUtils);
    const decoded = jwt.getUserFromToken(token);

    // Map the decoded token to our RequestWithUser type
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username
    };
    next();
  } catch (error) {
    next(error);
  }
}
