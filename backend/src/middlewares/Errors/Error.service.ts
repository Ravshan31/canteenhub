/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface, BadRequestError } from 'routing-controllers';
import { CustomLogger } from '../Logger/Logger.service';

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: Request, response: Response, next: NextFunction) {
        const logger = new CustomLogger();

        if (error.message === "Invalid body, check 'errors' property for more info.") {
            logger.useError(`[${request.method}] ${request.path} ${error.message}`);

            const errorData = error.errors.map((errorObj: {
                target: any,
                property: string,
                children: string[],
                constraints: any
            }) => {
                const errorValue = errorObj.property;
                const errorReason = Object.values(errorObj.constraints)[0];

                return {
                    value: errorValue,
                    reason: errorReason
                }
            })

            response.status(400).json({
                code: 400,
                msg: error.message,
                error: errorData
            })
            return;
        }

        if (error instanceof BadRequestError) {
            logger.useError(`[${request.method}] ${request.path} ${error.message}`);
        }

        logger.useError(`[${request.method}] ${request.path}`);

        console.log(error)
        next();
    }
}

// TODO Add CORS error handler