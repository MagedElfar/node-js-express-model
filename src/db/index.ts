import { Dialect, Model, ModelStatic, Sequelize } from "sequelize";
import config from "../config";
import { Logger } from "../utility/logger";

export interface IDatabaseConfigOptions {
    database: string;
    username: string;
    password: string;
    host: string;
    dialect: Dialect;
    port: number;
}

class DatabaseConfig {
    private static instance: DatabaseConfig;
    private _sequelize: Sequelize;
    private _config: IDatabaseConfigOptions;

    private constructor() {
        this._config = config.db

        this._sequelize = new Sequelize(
            this._config.database,
            this._config.username,
            this._config.password,
            {
                host: this._config.host,
                dialect: this._config.dialect,
                port: this._config.port,
                logging: false
            }
        );
    }

    public static getInstance(): DatabaseConfig {

        if (!DatabaseConfig.instance) {
            DatabaseConfig.instance = new DatabaseConfig();
        }
        return DatabaseConfig.instance;
    }

    public async testConnection(): Promise<boolean> {
        const logger = new Logger()

        try {
            await this._sequelize.authenticate();

            logger.info("Database connection has been established successfully.");
            return true;
        } catch (error) {
            logger.error("Unable to connect to the database:", null, error);
            return false;
        }
    }

    get sequelize(): Sequelize {
        return this._sequelize;
    }

    get config(): IDatabaseConfigOptions {
        return this._config;
    }
}

export default DatabaseConfig.getInstance();
