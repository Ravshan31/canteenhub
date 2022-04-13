import { CategoryRepository, DayRepository, MealRepository } from "../database";
import { Meal } from "../database/entries/Meal";
import { IAddMealDTO, IAddMealReturn } from "./Meal.interface";
import { imageDeleteHandler } from "./Meal.handlers";

export class MealService {
    static async addNewMeal(dataDTO: IAddMealDTO): Promise<IAddMealReturn> {
        // TODO Add JSON validation
        try {
            const daysRepository = await Promise.all(
                dataDTO.days.map(async (dayName) => {
                    const foundDay = await DayRepository.findOneBy({ name: dayName });
                    if (!foundDay) {
                        throw new Error("Given day is not found");
                    }
                    return foundDay;
                })
            );

            const category = await CategoryRepository.findOneBy({ name: dataDTO.category });
            if (!category) {
                imageDeleteHandler(dataDTO.imageUrl);

                return {
                    code: 400,
                    msg: "Meal was not added",
                    error: "Given category was not found"
                }
            }

            const newMeal = new Meal();
            newMeal.title = dataDTO.title;
            newMeal.description = dataDTO.description;
            newMeal.imageUrl = dataDTO.imageUrl;
            newMeal.isAvailable = dataDTO.isAvailable;
            newMeal.price = dataDTO.price;
            newMeal.category = category;
            newMeal.days = daysRepository;

            await MealRepository.save(newMeal);

            return {
                code: 201,
                msg: "Meal was added"
            }
        } catch (error) {
            imageDeleteHandler(dataDTO.imageUrl);
            let errorMsg = "Server/Database-related error";

            if (error instanceof Error) {
                if (error.message === "Given day is not found") {
                    errorMsg = error.message
                }
            }

            return {
                code: 500,
                msg: "Meal was not added",
                error: errorMsg
            }
        }
    }
}