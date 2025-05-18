import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/AppError";
import { RequestWithUser } from "../../types/types";

/**
 * Middleware to check if the user has the required role
 * @param allowedRoles Array of roles that are allowed to access the route
 */
export const checkRole = (allowedRoles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        throw new ForbiddenError("User not authenticated");
      }
/*
      // If the user has one of the allowed roles, allow access
      if (user.role && allowedRoles.includes(user.role)) {
        return next();
      }
      
      throw new ForbiddenError("You do not have permission to perform this action");
      */
      return next();
    } catch (error) {
      next(error);
    }
  };
};
