import dotenv from "dotenv";
import * as path from "path";
import { IDatabaseConfigOptions } from "./db";
import { ILogger, Logger } from "./utility/logger";

dotenv.config()

interface IConfig {
    server: {
        port: number,
        encryptionKey: string,
        mediaPath: string
    };

    db: IDatabaseConfigOptions,

    jwt: {
        secret: string,
        expire: string
    },

    email: {
        user: string,
        password: string
    },

    cloud: {
        apiKey: string,
        apiSecret: string,
        cloudName: string
    }
}

class ConfigError extends Error {
    constructor(variableName: string) {
        super(`Environment variable ${variableName} is missing.`);
        this.name = "ConfigError";
    }
}


class Config {
    private readonly configuration: IConfig;
    private static instance: Config;
    private logger: ILogger;

    private constructor() {
        this.logger = new Logger();

        this.configuration = {
            server: {
                port: parseInt(process.env.PORT || "5000"),
                encryptionKey: process.env.ENCRYPTION_KEY!,
                mediaPath: path.join(__dirname, "..", "public", "media"),
            },

            db: {
                database: process.env.DB_DATABASE!,
                username: process.env.DB_USERNAME!,
                password: process.env.DB_PASSWORD!,
                host: process.env.DB_HOST!,
                dialect: "mysql",
                port: parseInt(process.env.DB_PORT!),
            },

            jwt: {
                secret: process.env.JWT_SECRET!,
                expire: process.env.JWT_EXPIRE!
            },

            email: {
                user: process.env.GOOGLE_USER!,
                password: process.env.GOOGLE_PASSWORD!,
            },

            cloud: {
                apiKey: process.env.CLOUD_API_KEY!,
                apiSecret: process.env.CLOUD_API_SECRET!,
                cloudName: process.env.CLOUD_NAME!
            }
        }

        this.validateEnvironmentVariables()
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    private validateEnvironmentVariables() {
        const requiredVariables = [
            "PORT",
            "ENCRYPTION_KEY",
            "DB_DATABASE",
            "DB_USERNAME",
            // "DB_PASSWORD",
            "DB_HOST",
            "DB_PORT",
            "JWT_SECRET",
            "JWT_EXPIRE",
            "GOOGLE_USER",
            "GOOGLE_PASSWORD",
            "CLOUD_NAME",
            "CLOUD_API_KEY",
            "CLOUD_API_SECRET"
        ];

        for (const variable of requiredVariables) {
            if (!process.env[variable]) {
                this.logger.error("ConfigError:", null, {
                    error: `Environment variable ${variable} is missing.`
                })
                throw new Error(`Environment variable ${variable} is missing.`);
            }
        }
    }

    getConfiguration(): IConfig {
        return this.configuration
    }
}

export default Config.getInstance().getConfiguration()