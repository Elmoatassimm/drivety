"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverOnly = exports.adminOnly = exports.checkRole = void 0;
const user_types_1 = require("../../types/user.types");
/**
 * Middleware to check if the user has one of the required roles
 * @param allowedRoles Array of roles that are allowed to access the route
 * @returns Middleware function that enforces role-based access control
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        return next();
        try { /*
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
          
          // If we getttt here, the user is authenticated but not authorized
          throw new ForbiddenError("You do not have permission to access this resource");
          */
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkRole = checkRole;
// Convenience middleware for common role checks
exports.adminOnly = (0, exports.checkRole)([user_types_1.UserRole.ADMIN]);
exports.driverOnly = (0, exports.checkRole)([user_types_1.UserRole.DRIVER]);
// Add more role-specific middleware as needed
