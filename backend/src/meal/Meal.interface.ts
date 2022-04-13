import { IsBooleanString, IsJSON, IsNumberString, IsString, MinLength } from "class-validator";

export type daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export interface IAddMealDTO {
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
    @IsString( { message: "Given title is too short" })
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

    image!: Express.Multer.File
}