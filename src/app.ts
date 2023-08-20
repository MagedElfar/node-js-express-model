import express, { Application, Request, Response, json, urlencoded } from "express"
import morgan from "morgan";
import cors from "cors";
import router from "./routes";
import DatabaseConfig from "./db"
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { Logger } from "./utility/logger";
import swaggerSpec from "./swagger";
import swaggerUi from 'swagger-ui-express';
import * as path from "path";



class App {
    private app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.initDatabase();
        this.routes();
        this.errorHandling();
    }

    private config(): void {

        const middlewares: any[] = [
            cors(),
            morgan("short"),
            express.json({ limit: "10mb" }),
            express.urlencoded({ limit: "10mb", extended: true }),
        ];

        middlewares.forEach((middleware) => this.app.use(middleware));


        this.app.get("/", (req: Request, res: Response) => {
            res.send("app backend server")
        })

        this.app.use("/public", express.static(path.join(__dirname, '..', 'public')));

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            customCssUrl: "/public/css/swagger.css",
            customSiteTitle: "Rest API Documentation",
        }));

    }

    private async initDatabase(): Promise<void> {
        const isConnected = await DatabaseConfig.testConnection();
        if (!isConnected) {
            process.exit(1); // Exit the application if the database connection fails
        }
    }

    private errorHandling(): void {
        this.app.use(errorHandler);
    }

    private routes(): void {
        this.app.use("/api", router)
    }

    public getAppVariable(): Application {
        return this.app
    }


    public start(port: number): void {

        const logger = new Logger();

        process.on("uncaughtException", (err: any) => {
            logger.error("error ocurred", null, err)
            process.exit()
        })
        process.on("unhandledRejection", (err: any) => {
            logger.error("error ocurred", null, err)
            process.exit()
        })

        this.app.listen(port, () => {
            logger.info(`Server is running on port ${port}...`);
        });
    }
}

const app = new App();

export default app; 