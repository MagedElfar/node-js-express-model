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
import * as fs from "fs"


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

        // this.app.get('/download', (req, res) => {
        //     const filePath = path.join(__dirname, "..", "public", "media", "deploy.mp4"); // Replace with your file path

        //     const readStream = fs.createReadStream(filePath);

        //     let totalSize = 0;
        //     let loadedSize = 0;

        //     // Get the total size of the file
        //     fs.stat(filePath, (err: any, stats: any) => {
        //         if (err) {
        //             console.error('Unable to get file stats:', err);
        //             res.status(500).send('Internal Server Error');
        //         } else {
        //             totalSize = stats.size;

        //             console.log(totalSize)

        //             res.setHeader('Content-Length', totalSize);
        //             res.setHeader('Content-Type', 'application/octet-stream');
        //             res.setHeader('Content-Disposition', 'attachment; filename=file.txt');

        //             readStream.on('data', (chunk: any) => {
        //                 loadedSize += chunk.length;
        //                 const progress = (loadedSize / totalSize) * 100;
        //                 res.write(chunk);
        //                 console.log(`Loading: ${progress.toFixed(2)}%`);
        //             });

        //             readStream.on('end', () => {
        //                 res.end();
        //                 console.log('Loading completed');
        //             });

        //             readStream.on('error', (error: any) => {
        //                 console.error('An error occurred:', error);
        //                 res.status(500).send('Internal Server Error');
        //             });
        //         }
        //     });
        // });

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