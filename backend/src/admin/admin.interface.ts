import { IsEmail, IsNumberString, MinLength } from "class-validator";

export interface IBaseLoginReturn {
    code: number;
    msg: string;
    error?: string;
}

export interface ILoginReturnData extends IBaseLoginReturn {
    verifyCode?: string;
}

export interface IVerityLoginReturn extends IBaseLoginReturn {
    token?: string;
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

    @MinLength(6, { message: "Given verification code is too short" })
    @IsNumberString(undefined, { message: "Given verification code is incorrect" })
    emailCode!: string;
}