"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogLevel = void 0;
const tsyringe_1 = require("tsyringe");
/**
 * Log levels
 */
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARN"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["DEBUG"] = "debug";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
/**
 * Default logger configuration
 */
const defaultConfig = {
    level: process.env.LOG_LEVEL || LogLevel.INFO,
    enableConsole: process.env.NODE_ENV !== 'test',
    service: process.env.SERVICE_NAME || 'api',
};
/**
 * Logger class for application-wide logging
 */
let Logger = class Logger {
    /**
     * Create a new logger instance
     * @param context The context (class/file name) for this logger
     * @param config Optional logger configuration
     */
    constructor(context = 'App', config) {
        this.context = context;
        this.config = Object.assign(Object.assign({}, defaultConfig), config);
    }
    /**
     * Log an error message
     * @param message The message to log
     * @param meta Additional metadata
     */
    error(message, meta) {
        this.log(LogLevel.ERROR, message, meta);
    }
    /**
     * Log a warning message
     * @param message The message to log
     * @param meta Additional metadata
     */
    warn(message, meta) {
        this.log(LogLevel.WARN, message, meta);
    }
    /**
     * Log an info message
     * @param message The message to log
     * @param meta Additional metadata
     */
    info(message, meta) {
        this.log(LogLevel.INFO, message, meta);
    }
    /**
     * Log a debug message
     * @param message The message to log
     * @param meta Additional metadata
     */
    debug(message, meta) {
        this.log(LogLevel.DEBUG, message, meta);
    }
    /**
     * Internal log method
     * @param level Log level
     * @param message Message to log
     * @param meta Additional metadata
     */
    log(level, message, meta) {
        if (!this.shouldLog(level)) {
            return;
        }
        const timestamp = new Date().toISOString();
        const logEntry = Object.assign({ timestamp,
            level, context: this.context, service: this.config.service, message }, meta);
        if (this.config.enableConsole) {
            this.logToConsole(level, logEntry);
        }
    }
    /**
     * Determine if a message should be logged based on the configured level
     * @param level The level to check
     * @returns Whether the message should be logged
     */
    shouldLog(level) {
        const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
        const configLevelIndex = levels.indexOf(this.config.level);
        const messageLevelIndex = levels.indexOf(level);
        return messageLevelIndex <= configLevelIndex;
    }
    /**
     * Log to the console
     * @param level Log level
     * @param logEntry The log entry to output
     */
    logToConsole(level, logEntry) {
        const { timestamp, context, message } = logEntry, rest = __rest(logEntry, ["timestamp", "context", "message"]);
        const meta = Object.keys(rest).length > 0 ? rest : undefined;
        const consoleMethod = this.getConsoleMethod(level);
        const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
        if (meta) {
            consoleMethod(formattedMessage, meta);
        }
        else {
            consoleMethod(formattedMessage);
        }
    }
    /**
     * Get the appropriate console method for the log level
     * @param level Log level
     * @returns Console method
     */
    getConsoleMethod(level) {
        switch (level) {
            case LogLevel.ERROR:
                return console.error;
            case LogLevel.WARN:
                return console.warn;
            case LogLevel.DEBUG:
                return console.debug;
            case LogLevel.INFO:
            default:
                return console.info;
        }
    }
};
exports.Logger = Logger;
exports.Logger = Logger = __decorate([
    (0, tsyringe_1.injectable)(),
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [String, Object])
], Logger);
exports.default = Logger;
