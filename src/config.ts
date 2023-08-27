import dotenv from "dotenv";
import * as path from "path";
import { IDatabaseConfigOptions } from "./db";

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

class Config {
    private readonly configuration: IConfig;
    private static instance: Config;

    private constructor() {
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
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    getConfiguration(): IConfig {
        return this.configuration
    }
}

export default Config.getInstance().getConfiguration()