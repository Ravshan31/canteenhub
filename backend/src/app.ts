import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { useExpressServer } from "routing-controllers";
import { CustomErrorHandler } from "./middlewares/Errors/Error.service";
import { ICustomLogger } from "./middlewares/Logger/Logger.interface";
import { CustomLogger } from "./middlewares/Logger/Logger.service";

export class App {
    app: Express;
    port: number;
    logger: ICustomLogger;

    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        this.logger = new CustomLogger();
    }

    useMiddlewares() {
        this.app.use(express.json());

        // const allowedOrigins = [process.env.FRONTEND_ORIGIN, process.env.ADMIN_ORIGIN];
        this.app.use(cors({
            // origin: function (origin, callback) {
            //     if (allowedOrigins.includes(origin)) {
            //         callback(null, true)
            //     } else {
            //         callback(new Error('Not allowed by CORS'))
            //     }
            // },
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        this.app.use("/", (req: Request, _res: Response, next: NextFunction) => {
            this.logger.useLog(`[${req.method}] ${req.path}`);
            next();
        })
    }

    useRouters() {
        useExpressServer(this.app, {
            controllers: [],
            middlewares: [CustomErrorHandler],
            defaultErrorHandler: false,
        });

    }

    async init() {
        this.useMiddlewares();
        this.useRouters()

        this.app.listen(this.port);
        this.logger.useLog(`Server started on the port: http://localhost:${this.port}`)
    }
}