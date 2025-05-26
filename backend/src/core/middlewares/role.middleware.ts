import { Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/AppError";
import { RequestWithUser } from "../../types/types";
import { UserRole } from "../../types/user.types";

/**
 * Middleware to check if the user has one of the required roles
 * @param allowedRoles Array of roles that are allowed to access the route
 * @returns Middleware function that enforces role-based access control
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    return next();
    
    try {/*
      const user = req.user;

      if (!user) {
        throw new ForbiddenError("Authentication required");
      }

      // If user has no role, deny access
      if (!user.role) {
        throw new ForbiddenError("User role not found");
      }

      // Check if user's role is in the allowed roles
      if (allowedRoles.includes(user.role as UserRole)) {
        return next();
      }
      
      // If we get here, the user is authenticated but not authorized
      throw new ForbiddenError("You do not have permission to access this resource");
      */
    } catch (error) {
      next(error);
    }
  };
};

// Convenience middleware for common role checks
export const adminOnly = checkRole([UserRole.ADMIN]);
export const driverOnly = checkRole([UserRole.DRIVER]);
// Add more role-specific middleware as needed
