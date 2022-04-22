import { Response } from "express";
import { Body, JsonController, Post, Res } from "routing-controllers";
import { VLoginDataDTO, VVerifyLoginDTO } from "./admin.interface";
import { AdminService } from "./admin.service";

@JsonController("/admin")
export class AdminController {
    @Post("/login")
    async login(@Body() loginDTO: VLoginDataDTO, @Res() res: Response) {
        const loginData = await AdminService.login(loginDTO);
        res.status(loginData.code)

        return loginData;
    }

    @Post("/login-verify")
    async loginVerify(@Body() verifyDTO: VVerifyLoginDTO, @Res() res: Response) {
        const data = await AdminService.verifyLogin(verifyDTO);

        return data;
    }
}