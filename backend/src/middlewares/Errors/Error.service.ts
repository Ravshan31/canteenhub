/* eslint-disable @typescript-eslint/no-explicit-any */
import {} from 'cors';
import { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { CustomLogger } from '../Logger/Logger.service';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: NextFunction) {
        const logger = new CustomLogger();
        logger.useError(`[${request.method}] ${request.path}`);

        next();
    }
}

// TODO Add CORS error handler