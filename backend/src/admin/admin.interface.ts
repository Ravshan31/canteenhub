import { IsEmail, IsNumberString, MinLength } from "class-validator";

// TODO CREATE TYPES FOR FUNCTIONS

export interface ILoginDataDTO {
    email: string;
    password: string;
}

export interface ILoginReturnData {
    code: number;
    msg: string;
    verifyCode?: string;
    error?: string;
}

export class VLoginDataDTO {
    @IsEmail(undefined, { message: "Given email is not valid" })
    email!: string;

    @MinLength(6, { message: "Given password is too short" })
    password!: string;
}

export class VVerifyLoginDTO {
    @IsEmail(undefined, { message: "Given email is not valid" })
    email!: string;

    @MinLength(6, { message: "Given password is too short" })
    password!: string;
    
    @IsNumberString(undefined, { message: "Given verification code is incorrect" })
    emailCode!: string;
}