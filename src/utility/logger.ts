import { createLogger, transports, format, Logger as WinstonLogger } from 'winston';
import { Request } from 'express';
import { join, dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file'; // Import the DailyRotateFile transport

const logsDir = join(dirname(__dirname), '..', 'logs');

if (!existsSync(logsDir)) {
    mkdirSync(logsDir);
}

export interface ILogger {
    info(message: string, req: Request | null, logData?: any): void;
    error(message: string, req: Request | null, error?: any): void
}

export class Logger implements ILogger {
    private logger: WinstonLogger;

    constructor() {
        // Define the format for the console transport (with colorization)
        const consoleFormat = format.combine(
            format.colorize({
                all: true,
                colors: {
                    info: "blue",
                }
            }),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message, data }) => {
                const endpoint = data && data.endpoint ? ` [${data.endpoint}]` : '';
                const logData = data && data.logData ? ` ${JSON.stringify(data.logData, null, 2)}` : '';
                return `[${timestamp}] ${level}:${endpoint} ${message}${logData}`;
            })
        );

        // Define the format for the file transports (without colorization)
        const fileFormat = format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message, data }) => {
                const endpoint = data && data.endpoint ? ` [${data.endpoint}]` : '';
                const method = data && data.method ? ` ${data.method}` : '';
                const logData = data && data.logData ? ` ${JSON.stringify(data.logData, null, 2)}` : '';
                // return `[${timestamp}] ${level}:${endpoint} ${message}${logData}`;
                return `[${timestamp}] ${level}:${endpoint}${method} ${message}${logData}`;

            })
        );

        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.splat(),
                format.json()
            ),
            // defaultMeta: { service: 'your-service-name' },
            transports: [
                // Use the consoleFormat for the Console transport
                new transports.Console({
                    format: consoleFormat
                }),
                new DailyRotateFile({
                    filename: join(logsDir, 'error-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    level: 'error',
                    format: fileFormat // Use the fileFormat for file transports
                }),
                new DailyRotateFile({
                    filename: join(logsDir, 'logs-%DATE%.log'),
                    datePattern: 'YYYY-MM-DD',
                    format: fileFormat // Use the fileFormat for file transports
                }),
            ],
        });
    }

    public info(message: string, req: Request | null = null, logData?: any) {
        const data = req ? { endpoint: req.originalUrl, logData } : { logData };
        this.logger.info(message, { data });
    }

    public error(message: string, req: Request | null = null, errorData?: any) {
        const data = req ? {
            endpoint: req.originalUrl,
            logData: { errorData },
            method: req.method
        } : { logData: { errorData } };
        this.logger.error(message, { data });
    }
}
