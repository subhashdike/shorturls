/* eslint-disable @typescript-eslint/no-explicit-any */
import * as winston from "winston";
import { serializeError } from "serialize-error";
import * as safeStringify from "safe-stable-stringify";
import { format } from "logform";
import { v4 } from "uuid";
import { IConfig } from "./config";
import TransportStream = require("winston-transport");

export enum LogLevel {
  emerg = 0,
  alert = 1,
  crit = 2,
  error = 3,
  warning = 4,
  notice = 5,
  info = 6,
  debug = 7,
}

export interface ILogger {
  initialize(config: IConfig): void;
  logInfo(logMessage: string, additionalParamters?: any): string;
  logError(logMessage: string, additionalParameter?: any): string;
  log(level: LogLevel, logMessage: string, additionalParamters?: any): string;
}

class Logger implements ILogger {
  private config!: IConfig;
  private logger!: winston.Logger;

  initialize(config: IConfig) {
    this.config = config;
    this.logger = winston.createLogger({
      format: format.combine(
        format.json(),
        format.errors({ stack: true }),
        format.metadata(),
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.splat(),
        format.printf(
          (info) =>
            `[${info.level}] ${info.timestamp} - ${
              info.message
            } ${this.formatErrorObject(info)}`
        )
      ),
      transports: this.getTransports(),
    });

    process.on("unhandledRejection", (source) => {
      //Two Notes about this
      //1. Ideally logger configuration itself shuold take a parameter about rejectionhandler or handleRejection,but at this moment that's not working
      //2. The source parameter should be error object with stack trace, but the as of today types doesn't define it as Error object so stack trace isn't there
      this.logError(`Unhandled Rejection at with reason:' ${source}`, source);
    });
  }

  logError(logMessage: string, additionalParamters?: any): string {
    const error = serializeError(additionalParamters);
    return this.log(LogLevel.error, logMessage, error);
  }

  logInfo(logMessage: string, additionalParamters?: any): string {
    return this.log(LogLevel.info, logMessage, additionalParamters);
  }

  log(
    logLevel: LogLevel,
    logMessage: string,
    additionalParamters?: any
  ): string {
    const messageId: string = v4();
    const message =
      logMessage && logMessage != ""
        ? logMessage
        : "No log message was provided";
    this.logger.log({
      level: LogLevel[logLevel],
      message,
      metadata: safeStringify.default(additionalParamters),
    });
    return messageId;
  }

  private getTransports(): TransportStream[] {
    const allTransports: winston.transport[] = [
      new winston.transports.File({
        filename: "error.log",
        level: "error",
        handleExceptions: true,
      }),
    ];
    if (this.config.get("NODE_ENV") !== "production") {
      allTransports.push(this.configureConsoleTransport());
    }
    return allTransports;
  }

  private configureConsoleTransport() {
    return new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(winston.format.simple()),
    });
  }

  private formatErrorObject(info: any) {
    return safeStringify.default(
      Object.assign({}, info, {
        level: undefined,
        message: undefined,
        splat: undefined,
        label: undefined,
        timestamp: undefined,
      })
    );
  }
}

const logger = new Logger(); //We need only one instance across the application contexts
export { logger };
