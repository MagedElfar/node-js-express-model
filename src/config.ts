import dotenv from "dotenv";
import { IDatabaseConfigOptions } from "./db";

dotenv.config()

interface IConfig {
    server: {
        port: number
    };

    db: IDatabaseConfigOptions,

    jwt: {
        secret: string,
        expire: string
    }
}

class Config {
    private readonly configuration: IConfig;
    private static instance: Config;

    private constructor() {
        this.configuration = {
            server: {
                port: parseInt(process.env.PORT || "5000")
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