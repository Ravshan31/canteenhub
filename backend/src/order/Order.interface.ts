import { IsArray, IsEmail, IsNumber, IsNumberString, IsObject, IsPhoneNumber, IsPositive, MinLength, ValidateNested } from "class-validator";

export interface IBaseReturnData {
    code: number;
    msg: string;
    error?: string
}

export interface IMealOrder {
    mealId: number;
    amount: number;
}

export interface IReturnMealOrder extends IBaseReturnData {
    orderId?: number
}

export class VAddOrderDTO {
    @IsEmail(undefined, { message: "Given email is not email" })
    email!: string;

    @IsPhoneNumber("UZ", { message: "Given phone number is not Uzbek" })
    phone!: string;

    @IsArray({ message: "Given meals must be in array" })
    @IsObject({ each: true, message: "Given meals are not in object" })
    orderData!: IMealOrder[]
}

export class VVerifyOrderDTO {
    @IsPositive({ message: "Given id is negative" })
    orderId!: number;

    @MinLength(6, { message: "Given code is too short" })
    @IsNumberString({ no_symbols: true }, { message: "Given code is incorrect" })
    verficationCode!: string;
}