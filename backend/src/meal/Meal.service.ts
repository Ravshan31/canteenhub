import { CategoryRepository, DayRepository, MealRepository } from "../database";
import { Meal } from "../database/entries/Meal";
import { IAddMealDTO, IAddMealReturn, IReturnSingleGame, VPaganationDTO } from "./Meal.interface";
import { imageDeleteHandler } from "./Meal.handlers";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

export class MealService {
    static async addNewMeal(dataDTO: IAddMealDTO): Promise<IAddMealReturn> {
        try {
            const tokenVerify = jwt.verify(dataDTO.token, process.env.JWT_TOKEN!);

            if (!tokenVerify) {
                return {
                    code: 400,
                    msg: "Meal was not added",
                    error: "Authorization failed"
                }
            }

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

            if (error instanceof JsonWebTokenError) {
                errorMsg = error.message
            }

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

    static async getSingleMeal(mealId: number): Promise<IReturnSingleGame> {
        try {
            const mealData = await MealRepository.findOne({
                where: { id: mealId },
                relations: ["category", "days"]
            });

            if (!mealData) {
                return {
                    code: 404,
                    msg: "Meal was not found",
                    error: "Given meal id does not exist"
                }
            }

            return {
                code: 200,
                msg: "Meal was found",
                data: mealData
            }
        } catch (error) {
            return {
                code: 500,
                msg: "Meal was not found",
                error: "Database/Server-related error"
            }
        }
    }

    static async getAllMeals(paganationData: VPaganationDTO) {
        const { skip, take } = paganationData;

        try {
            const mealsData = await MealRepository
                .createQueryBuilder("meal")
                .leftJoinAndSelect("meal.category", "categories")
                .orderBy("meal.id", "DESC")
                .skip(skip)
                .take(take)
                .getMany();

            return {
                code: 200,
                msg: "Meals found successfully",
                data: mealsData
            }
        } catch (error) {
            return {
                code: 500,
                msg: "Meals found successfully",
                error: "Database/Server-related error"
            }
        }
    }

    static async getMealsByDay(dayName: string, paganationData: VPaganationDTO) {
        try {
            const dayData = await DayRepository.findOneBy({ name: dayName });

            if (!dayData) {
                return {
                    code: 404,
                    msg: "Meals were not found",
                    error: "Given day is invalid"
                }
            }

            const { skip, take } = paganationData;

            const mealsData = await MealRepository
                .createQueryBuilder("meal")
                .innerJoinAndSelect("meal.category", "categories")
                .leftJoinAndSelect("meal.days", "days")
                .innerJoin('meal.days',
                    'day',
                    'day.id = :dayId',
                    { dayId: dayData.id })
                .orderBy("meal.id", "DESC")
                .skip(skip)
                .take(take)
                .getMany()

            return {
                code: 200,
                msg: "Meals found",
                data: mealsData
            }
        } catch (error) {
            return {
                code: 200,
                msg: "Meals were not found",
                error: "Database/Server-related error"
            }
        }

    }
}