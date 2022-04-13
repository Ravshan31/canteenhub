import { Request, Response } from "express";
import { Body, Controller, Get, Post, Req, Res } from "routing-controllers";
import { IAddMealDTO, IAddMealReturn, VAddMealDTO } from "./Meal.interface";
import { MealService } from "./Meal.service";

/**
 TODO Features
 * Add new meal
 * Get all meals
 * Get meals by day
 * Get meal by id
 */

@Controller("/meals")
export class MealController {
    @Post("/add")
    async name(@Body() dataDTO: VAddMealDTO, @Req() req: Request, @Res() res: Response): Promise<IAddMealReturn> {
        // TODO Add JWT validation
        const image = req.file;

        if (!image) {
            return {
                code: 422,
                msg: "Meal was not added",
                error: "Given image has incorrect extension"
            }
        }

        const isAvailable: boolean = JSON.parse(dataDTO.isAvailable);
        const days: string[] = JSON.parse(dataDTO.days);
        const mealUrl = image.path;

        const mealDTO: IAddMealDTO = {
            title: dataDTO.title,
            description: dataDTO.description,
            imageUrl: mealUrl,
            price: +dataDTO.price,
            category: dataDTO.category,
            isAvailable: isAvailable,
            days: days
        }

        const serviceData = await MealService.addNewMeal(mealDTO)

        return serviceData;
    }

    @Get("/meals")
    getAll() {
        return { msg: "meals" }
    }
}