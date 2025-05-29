"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const container_1 = require("./config/container");
const routes_1 = __importDefault(require("./routes"));
const response_utils_1 = __importDefault(require("./core/utils/response.utils"));
const errors_middleware_1 = __importDefault(require("./core/middlewares/errors.middleware"));
const parseQueryParams_middleware_1 = __importDefault(require("./core/middlewares/parseQueryParams.middleware"));
const listEndpoints = require("express-list-endpoints");
const app = (0, express_1.default)();
// Configure rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    headers: true, // Send rate limit headers in responses
});
// Apply rate limiter globally
app.use(limiter);
// Enable CORS for all routes
app.use((0, cors_1.default)());
// Apply Helmet for security headers
app.use((0, helmet_1.default)());
// Middleware to parse JSON
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Logging middleware
app.use((0, morgan_1.default)("dev"));
// Apply query parameter parsing middleware
app.use(parseQueryParams_middleware_1.default);
// Apply API routes
app.use("/", routes_1.default);
// 404 Handler
app.use("*", (_req, res, _next) => {
    const responseUtils = container_1.container.resolve(response_utils_1.default);
    responseUtils.sendNotFoundResponse(res, "Endpoint not found");
});
console.log(listEndpoints(app));
// Global Error Handler
const globalErrorHandler = container_1.container.resolve(errors_middleware_1.default);
app.use((err, req, res, next) => {
    globalErrorHandler.handle(err, req, res, next);
});
// Start the server only when this file is executed directly, not when imported
if (require.main === module) {
    const PORT = process.env.PORT || 3005;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
exports.default = app;
