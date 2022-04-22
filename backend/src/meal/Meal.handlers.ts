import { unlink } from "fs";
import { join } from "path";
import { cwd } from "process";
import { CustomLogger } from "../middlewares/Logger/Logger.service";

const logger = new CustomLogger();

export const imageDeleteHandler = (imageUrl: string) => {
    const imagePath = imageUrl;
    const pathToFile = join(cwd(), imagePath);
    unlink(pathToFile, (error) => {
        if (error) {
            logger.useError(`${imagePath.replace("images\\", "")} was not deleted. Error: ${error.message}`);
        }
    })

    logger.useWarn(`${imagePath.replace("images\\", "")} was deleted`);
}
