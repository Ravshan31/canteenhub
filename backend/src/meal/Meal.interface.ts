import { IsBooleanString, IsJSON, IsNumber, IsNumberString, IsString, MinLength } from "class-validator";
import { Meal } from "../database/entries/Meal";

interface IReturnBase {
    code: number;
    msg: string;
    error?: string;
}

export interface IReturnSingleGame extends IReturnBase {
    data?: Meal;
}

export interface IReturnMealsPaganation extends IReturnBase {
    data?: Meal[];
}

export interface IReturnMealsByDay extends IReturnBase {
    data?: Meal[];
}

export interface IAddMealDTO {
    token: string
    title: string;
    description: string;
    days: string[];
    price: number;
    category: string;
    isAvailable: boolean;
    imageUrl: string;
}

export interface IAddMealReturn {
    code: number;
    msg: string;
    error?: string | string[];
}

export class VAddMealDTO {
    @IsString({ message: "Given title is too short" })
    title!: string;

    @MinLength(5, { message: "Given description is too short" })
    description!: string;

    @IsJSON({ message: "Given days are not in JSON" })
    days!: string

    @IsNumberString({ no_symbols: true }, { message: "Given price is not a number" })
    price!: string;

    @IsString({ message: "Given category is not a string" })
    category!: string;

    @IsBooleanString({ message: "Given value is not a boolean" })
    isAvailable!: string;

    image!: Express.Multer.File;
}

export class VPaganationDTO {
    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: "Given skip is not a number" })
    skip!: number;

    @IsNumber({ allowNaN: false, allowInfinity: false }, { message: "Given take is not a number" })
    take!: number;
}