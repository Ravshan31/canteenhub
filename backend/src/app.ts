import { join } from "path";
import { cwd } from "process";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import { useExpressServer } from "routing-controllers";
import { ICustomLogger } from "./middlewares/Logger/Logger.interface";
import { CustomLogger } from "./middlewares/Logger/Logger.service";
import { CustomErrorHandler } from "./middlewares/Errors/Error.service";
import { AppDataSource } from "./database/index";
import { TypeORMError } from "typeorm";

import { MealController } from "./meal/Meal.controller";
import { AdminController } from "./admin/admin.controller";
import { OrderController } from "./order/Order.controller";

export class App {
    app: Express;
    port: number;
    logger: ICustomLogger;

    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        this.logger = new CustomLogger();
    }

    private useMiddlewares() {
        this.app.use(express.urlencoded({ extended: true }))
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

    private useMulter() {
        this.app.use("/images", express.static(join(cwd(), "/images")));

        const fileStorageSettings = multer.diskStorage({
            destination: (_req, _file, callbackFunc) => {
                callbackFunc(null, "images")
            },
            filename: (_req, file, callbackFunc) => {
                const fileExtension = file.mimetype.replace("image/", "")
                const fileName = `${file.originalname.substring(0, 5).toLowerCase().replace(/\//, "").replace(/\\/, "").replace(/\|/, "")}-${Date.now()}.${fileExtension}`;

                callbackFunc(null, fileName)
            }
        });
        const fileFilter = (_req: Request, file: Express.Multer.File, callbackFunc: multer.FileFilterCallback) => {
            if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
                callbackFunc(null, true)
            } else {
                callbackFunc(null, false)
            }
        }
        this.app.use(multer({ storage: fileStorageSettings, fileFilter: fileFilter }).single("image"))
    }

    private async useDatabases() {
        await AppDataSource.initialize();
    }

    private useRouters() {
        useExpressServer(this.app, {
            controllers: [MealController, AdminController, OrderController],
            middlewares: [CustomErrorHandler],
            defaultErrorHandler: false,
        });
    }

    public async init() {
        this.useMiddlewares()
        this.useMulter();
        this.useRouters();

        try {
            await this.useDatabases();
            this.app.listen(this.port);
            this.logger.useLog(`Server started on the port: http://localhost:${this.port}`)
        } catch (error) {
            if (error instanceof TypeORMError) {
                this.logger.useError(`[Database error] ${error.message}`);
            } else if (error instanceof Error) {
                this.logger.useError(`[Server error] ${error.message}`);
            }
        }

    }
}