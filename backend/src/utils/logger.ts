import { injectable, singleton } from 'tsyringe';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  service?: string;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
  enableConsole: process.env.NODE_ENV !== 'test',
  service: process.env.SERVICE_NAME || 'api',
};

/**
 * Logger class for application-wide logging
 */
@injectable()
@singleton()
export class Logger {
  private config: LoggerConfig;
  private context: string;

  /**
   * Create a new logger instance
   * @param context The context (class/file name) for this logger
   * @param config Optional logger configuration
   */
  constructor(context: string = 'App', config?: Partial<LoggerConfig>) {
    this.context = context;
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Log an error message
   * @param message The message to log
   * @param meta Additional metadata
   */
  error(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Log a warning message
   * @param message The message to log
   * @param meta Additional metadata
   */
  warn(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Log an info message
   * @param message The message to log
   * @param meta Additional metadata
   */
  info(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Log a debug message
   * @param message The message to log
   * @param meta Additional metadata
   */
  debug(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  /**
   * Internal log method
   * @param level Log level
   * @param message Message to log
   * @param meta Additional metadata
   */
  private log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      service: this.config.service,
      message,
      ...meta,
    };

    if (this.config.enableConsole) {
      this.logToConsole(level, logEntry);
    }
  }

  /**
   * Determine if a message should be logged based on the configured level
   * @param level The level to check
   * @returns Whether the message should be logged
   */
  private shouldLog(level: LogLevel): boolean {
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
  private logToConsole(level: LogLevel, logEntry: Record<string, any>): void {
    const { timestamp, context, message, ...rest } = logEntry;
    const meta = Object.keys(rest).length > 0 ? rest : undefined;

    const consoleMethod = this.getConsoleMethod(level);
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;

    if (meta) {
      consoleMethod(formattedMessage, meta);
    } else {
      consoleMethod(formattedMessage);
    }
  }

  /**
   * Get the appropriate console method for the log level
   * @param level Log level
   * @returns Console method
   */
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
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
}

export default Logger;
