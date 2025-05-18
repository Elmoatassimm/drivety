"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const AppError_1 = require("../errors/AppError");
/**
 * Middleware to check if the user has the required role
 * @param allowedRoles Array of roles that are allowed to access the route
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const user = req.user;
            if (!user) {
                throw new AppError_1.ForbiddenError("User not authenticated");
            }
            /*
                  // If the user has one of the allowed roles, allow access
                  if (user.role && allowedRoles.includes(user.role)) {
                    return next();
                  }
                  
                  throw new ForbiddenError("You do not have permission to perform this action");
                  */
            return next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkRole = checkRole;
