import { createTransport } from "nodemailer";
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { AdminRepository } from "../database";
import { ILoginReturnData, IVerityLoginReturn, VLoginDataDTO, VVerifyLoginDTO } from "./admin.interface";

declare module 'jsonwebtoken' {
    export interface EmailCodeJwtPayload extends jwt.JwtPayload {
        code: number,
        exp: number
    }
}

export class AdminService {
    static async login(dataDTO: VLoginDataDTO): Promise<ILoginReturnData> {
        const { email: givenEmail, password: givenPassword } = dataDTO;
        try {
            const isFoundEmail = await AdminRepository.findOneBy({ email: givenEmail });
            if (!isFoundEmail) {
                return {
                    code: 404,
                    msg: "Login failed",
                    error: "Given email was not found"
                }
            }

            const checkPassword = await bcrypt.compare(givenPassword, isFoundEmail.password);

            if (!checkPassword) {
                return {
                    code: 403,
                    msg: "Login failed",
                    error: "Given password is incorrect"
                }
            }

            const emailTransporter = createTransport({
                host: process.env.PROVIDER_MAILER!,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_MAILER!,
                    pass: process.env.PASS_MAILER!
                }
            });

            const verifyCode = Math.floor(100000 + Math.random() * 900000);

            const jwtCode = jwt.sign({ code: verifyCode }, process.env.JWT_VERIFICATION!, { expiresIn: "10m" });

            isFoundEmail.emailCode = jwtCode;
            await AdminRepository.save(isFoundEmail);

            const emailDateTo = new Date(new Date().getTime() + 10 * 60000)
                .toLocaleDateString("en-En", {
                    hour12: false,
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                });


            emailTransporter.sendMail({
                from: `CanteenHub Bot <${process.env.EMAIL_MAILER}>`,
                to: isFoundEmail.email,
                subject: "CanteenHub - Verify your admin login",
                html: `
                <div>
                    <h1>Email Verification</h1>
                    <h2>Hello!</h2>
                    <p>Please, verify your email with with following code: <code>${verifyCode}<code/></p>
                    <p>Verify your login within 10 minutes, unless it would expire</p>
                    <p>You can use this code until: ${emailDateTo}</p>
                </div>`,
            }, (error) => {
                if (error) {
                    throw new Error("Sending email failed")
                }
            });

            return {
                code: 200,
                msg: "Code send successfully",
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Sending email failed") {
                    return {
                        code: 500,
                        msg: "Login failed",
                        error: "Sending email failed"
                    }
                }
            }


            return {
                code: 500,
                msg: "Login failed",
                error: "Server/Database-related error"
            }
        }
    }

    static async verifyLogin(dataDTO: VVerifyLoginDTO): Promise<IVerityLoginReturn> {
        const { email, password, emailCode } = dataDTO;

        try {
            const adminAccount = await AdminRepository.findOneBy({ email: email });
            if (!adminAccount) {
                return {
                    code: 404,
                    msg: "Login verification failed",
                    error: "Given email was not found"
                }
            }

            const checkPassword = await bcrypt.compare(password, adminAccount.password);

            if (!checkPassword) {
                return {
                    code: 403,
                    msg: "Login verification failed",
                    error: "Given password is incorrect"
                }
            }

            const jwtData = <jwt.EmailCodeJwtPayload>jwt.verify(adminAccount.emailCode, process.env.JWT_VERIFICATION!);

            const { code, exp } = jwtData;

            const emailTokenExpDate = new Date(exp * 1000);
            const currentDate = new Date();

            if (currentDate > emailTokenExpDate) {
                return {
                    code: 400,
                    msg: "Login verification failed",
                    error: "Given code is expired"
                }
            }

            if (+emailCode !== code) {
                return {
                    code: 400,
                    msg: "Login verification failed",
                    error: "Given code does not match with sent code"
                }
            }

            const jwtToken = jwt.sign({ sub: adminAccount.id, adminEmail: adminAccount.email }, process.env.JWT_TOKEN!)

            return {
                code: 200,
                msg: "Login verification passed",
                token: jwtToken
            }
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                return {
                    code: 400,
                    msg: "Login verification failed",
                    error: "Given code is expired",
                }
            }

            return {
                code: 500,
                msg: "Login verification failed",
                error: "Database/Server-related error",
            }
        }
    }
}