import { Response } from "express";
import { Body, JsonController, Post, Res } from "routing-controllers";
import { AdminService } from "./admin.service";
import { ILoginReturnData, IVerityLoginReturn, VLoginDataDTO, VVerifyLoginDTO } from "./admin.interface";

@JsonController("/admin")
export class AdminController {
    @Post("/login")
    async login(@Body() loginDTO: VLoginDataDTO, @Res() res: Response): Promise<ILoginReturnData> {
        const loginData = await AdminService.login(loginDTO);

        res.status(loginData.code);
        return loginData;
    }

    @Post("/login-verify")
    async loginVerify(@Body() verifyDTO: VVerifyLoginDTO, @Res() res: Response): Promise<IVerityLoginReturn> {
        const data = await AdminService.verifyLogin(verifyDTO);

        res.status(data.code);
        return data;
    }
}