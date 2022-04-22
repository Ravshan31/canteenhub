import { Request, Response } from "express";
import { Body, Controller, Get, Param, Post, Req, Res } from "routing-controllers";
import { IAddMealDTO, IAddMealReturn, IReturnMealsPaganation, IReturnSingleGame, VAddMealDTO, VPaganationDTO } from "./Meal.interface";
import { MealService } from "./Meal.service";

/**
 DONE Features
 * Add new meal - Done
 * Get all meals - Done
 * Get meals by day - Done
 * Get meal by id - Done
 */

@Controller("/meals")
export class MealController {
    @Post("/add")
    async addNewMeal(@Body() dataDTO: VAddMealDTO, @Req() req: Request, @Res() res: Response): Promise<IAddMealReturn> {
        // TODO Add JWT validation
        const token = req.get("Authorization")?.split(" ")[1];

        if (!token) {
            return {
                code: 400,
                msg: "Meal was not added",
                error: "Authorization failed"
            }
        }

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
            days: days,
            token: token
        }

        const serviceData = await MealService.addNewMeal(mealDTO);
        res.status(serviceData.code);

        return serviceData;
    }

    @Get("/meal/:mealId")
    async getSingleMeal(@Param("mealId") mealId: string, @Res() res: Response): Promise<IReturnSingleGame> {
        const id = +mealId;
        const data = await MealService.getSingleMeal(id);
        res.status(data.code);

        return data
    }

    @Post("/day/:dayName")
    async getMealsByDay(@Param("dayName") dayName: string, @Body() paganationDTO: VPaganationDTO, @Res() res: Response) {
        const data = await MealService.getMealsByDay(dayName, paganationDTO)

        res.status(data.code);
        return data
    }

    @Post("/all")
    async getAll(@Body() paganationDTO: VPaganationDTO, @Res() res: Response): Promise<IReturnMealsPaganation> {
        const data = await MealService.getAllMeals(paganationDTO);
        res.status(data.code);

        return data;
    }
}