import { Logger } from "tslog";
import { ICustomLogger } from "./Logger.interface";

export class CustomLogger extends Logger implements ICustomLogger {
    logger: Logger;

    constructor() {
        super();
        this.logger = new Logger({
            displayInstanceName: false,
            displayLoggerName: false,
            displayFilePath: "hidden",
            displayFunctionName: false,
            dateTimeTimezone: "Asia/Tashkent",
            dateTimePattern: "year-month-day hour:minute:second"
        })
    }

    useLog(...args: unknown[]): void {
        this.logger.info(...args);
    }
    useWarn(...args: unknown[]): void {
        this.logger.warn(...args);
    }
    useError(...args: unknown[]): void {
        this.logger.error(...args);
    }
}