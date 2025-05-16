import { container } from "tsyringe";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserRouter } from "./user.routes";

export function registerUserDependencies() {
  // Register interfaces to implementations
  container.register("IUserRepository", { useClass: UserRepository });

  // Register concrete classes
  container.register(UserRepository, { useClass: UserRepository });
  container.register(UserService, { useClass: UserService });
  container.register(UserController, { useClass: UserController });
  container.register(UserRouter, { useClass: UserRouter });

  // Register for string-based injection
  container.register("UserService", { useClass: UserService });
  container.register("UserController", { useClass: UserController });
}
