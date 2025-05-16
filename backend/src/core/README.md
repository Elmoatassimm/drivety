# Core Framework Components

This directory contains the core framework components that provide a foundation for building RESTful APIs with standardized patterns.

## Base Classes

### BaseRepository

A generic repository class that provides CRUD operations for any entity. It handles common database operations and error handling.

### BaseService

A generic service class that provides business logic for CRUD operations. It uses a repository for data access and adds additional error handling and validation.

### BaseController

A generic controller class that handles HTTP requests and responses. It uses a service for business logic and provides standardized endpoints for CRUD operations.

### RouteFactory

A factory class that creates standardized routes for a controller. It handles route registration, middleware application, and request validation.

### BaseRouter

A router class that combines a controller and route factory to create a complete API router for a resource.

## Usage Example

Here's an example of how to use these base components to create a complete API for a resource:

```typescript
// 1. Create a repository
@injectable()
class UserRepository extends BaseRepository<User> {
  constructor(@inject("db") prismaService: PrismaService) {
    super(prismaService);
    this.modelName = "user"; // Set the Prisma model name
  }
}

// 2. Create a service
@injectable()
class UserService extends BaseService<User> {
  constructor(@inject(UserRepository) repository: UserRepository) {
    super(repository, "User"); // Pass the repository and resource name
  }

  protected getEntityName(): string {
    return "User";
  }
  
  // Add custom business logic methods here
}

// 3. Create a controller
@injectable()
class UserController extends BaseController<User> {
  constructor(
    @inject(UserService) service: UserService,
    @inject("responseUtils") responseUtils: ResponseUtils
  ) {
    super(service, responseUtils);
  }
  
  // Add custom controller methods here
}

// 4. Create validation schemas
const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6)
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).optional()
});

// 5. Create a router
const userRouter = new BaseRouter<User>(
  container.resolve(UserController),
  "users",
  createUserSchema,
  updateUserSchema,
  true // Require authentication
);

// 6. Register the router in your main router
mainRouter.use(`/${userRouter.getBasePath()}`, userRouter.getRouter());
```

This setup provides a complete RESTful API with the following endpoints:
- `GET /users` - Get all users
- `GET /users/:id` - Get a user by ID
- `POST /users` - Create a new user (with validation)
- `PUT /users/:id` - Update a user (with validation)
- `DELETE /users/:id` - Delete a user

All endpoints include proper error handling, validation, and authentication (if required).
