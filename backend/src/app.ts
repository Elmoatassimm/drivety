import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { container } from "./config/container";
import routes from "./routes";
import ResponseUtils from "./core/utils/response.utils";
import GlobalErrorHandler from "./core/middlewares/errors.middleware";
import { TFindInput } from "./types/types";
import parseQueryParams from "./core/middlewares/parseQueryParams.middleware";
import listEndpoints = require("express-list-endpoints");
// Extend Express Request type to include queryParams
declare module "express-serve-static-core" {
  interface Request {
    queryParams: TFindInput;
  }
}

const app: Application = express();

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true, // Send rate limit headers in responses
});

// Apply rate limiter globally
app.use(limiter);

// Enable CORS for all routes
app.use(cors());

// Apply Helmet for security headers
app.use(helmet());

// Middleware to parse JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Logging middleware
app.use(morgan("dev"));

// Apply query parameter parsing middleware
app.use(parseQueryParams);

// Apply API routes
app.use("/", routes);

// 404 Handler
app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
  const responseUtils = container.resolve(ResponseUtils);
  responseUtils.sendNotFoundResponse(res, "Endpoint not found");
});

console.log(listEndpoints(app));

// Global Error Handler
const globalErrorHandler = container.resolve(GlobalErrorHandler);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler.handle(err, req, res, next);
});

// Start the server only when this file is executed directly, not when imported
if (require.main === module) {
  const PORT = process.env.PORT || 3005;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
