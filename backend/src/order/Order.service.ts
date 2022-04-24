import axios from 'axios';
import jwt, { JsonWebTokenError, OrderJWTPayload } from 'jsonwebtoken';
import { createTransport } from "nodemailer";
import { BadRequestError } from "routing-controllers";
import { Order } from "../database/entries/Order";
import { OrderMeal } from "../database/entries/OrderMeal";
import { MealRepository, OrderMealRepository, OrderRepository } from "../database";
import { IBaseReturnData, IReturnMealOrder, VAddOrderDTO, VVerifyOrderDTO } from "./Order.interface";

declare module 'jsonwebtoken' {
    export interface OrderJWTPayload extends jwt.JwtPayload {
        code: number,
        exp: number
    }
}

export class OrderService {
    static async addNewOrder(orderDTO: VAddOrderDTO): Promise<IReturnMealOrder> {
        const { email, phone, orderData } = orderDTO;

        try {
            const arrayOfMealsId = orderData.map(data => data.mealId);

            for (let i = 0; i < arrayOfMealsId.length; i++) {
                const currentElement = arrayOfMealsId[i];
                const indexOfElement = arrayOfMealsId.indexOf(currentElement);
                if (indexOfElement !== i) {
                    throw new BadRequestError("Dublicated array of orders")
                }
            }

            await Promise.all(
                arrayOfMealsId.map(async (mealId) => {
                    const foundMeal = await MealRepository.findOneBy({ id: mealId })
                    if (!foundMeal) {
                        throw new Error("Given meal is incorrect")
                    }
                })
            )

            const verifyCode = Math.floor(100000 + Math.random() * 900000);
            const jwtOrder = jwt.sign({ email: email, code: verifyCode }, process.env.JWT_ORDER!, { expiresIn: "5m" });

            const order = new Order();
            order.order_email = email;
            order.order_phone = phone;
            order.order_verified = false;
            order.order_token = jwtOrder;
            const savedOrder = await OrderRepository.save(order);

            for await (const data of orderData) {
                const newOrderMeal = new OrderMeal();
                newOrderMeal.orderId = order.order_id;
                newOrderMeal.mealId = data.mealId;
                newOrderMeal.amount = data.amount;
                await OrderMealRepository.save(newOrderMeal);
            }

            const emailDateTo = new Date(new Date().getTime() + 5 * 60000)
                .toLocaleDateString("en-En", {
                    hour12: false,
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                });

            const emailTransporter = createTransport({
                host: process.env.PROVIDER_MAILER!,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_MAILER!,
                    pass: process.env.PASS_MAILER!
                }
            });


            emailTransporter.sendMail({
                from: `CanteenHub Bot <${process.env.EMAIL_MAILER}>`,
                to: email,
                subject: "Verify Your Order",
                html: `
                    <div>
                        <h2>Hello!</h2>
                        <p>Please, verify your order with with following code: <code>${verifyCode}<code/></p>
                        <p>Verify your order within 5 minutes, unless it would expire</p>
                        <p>You can use this code until: ${emailDateTo}</p>
                    </div>`,
            }, (error) => {
                if (error) {
                    throw new Error("Sending email failed")
                }
            });

            return {
                code: 201,
                msg: "Verification code sent successfully",
                orderId: savedOrder.order_id
            }
        } catch (error) {
            const message = "Verification code was not send";
            let code = 500;
            let errorMsg = "Database/Server-related error"

            if (error instanceof Error) {
                if (error.message === "Sending email failed") {
                    code = 502;
                    errorMsg = error.message;
                }

                if (error instanceof BadRequestError) {
                    code = error.httpCode;
                    errorMsg = error.message;
                }
            }

            return {
                code: code,
                msg: message,
                error: errorMsg
            }
        }
    }

    static async verifyNewOrder(orderDTO: VVerifyOrderDTO): Promise<IBaseReturnData> {
        const { orderId, verficationCode } = orderDTO;

        try {
            const order = await OrderRepository.findOneBy({ order_id: orderId });

            if (!order) {
                return {
                    code: 404,
                    msg: "Order verification failed",
                    error: "Given orderId does not exist"
                }
            }

            if (order.order_verified) {
                return {
                    code: 400,
                    msg: "Order verification failed",
                    error: "Given order is already verified"
                }
            }

            const jwtToken = <OrderJWTPayload>jwt.verify(order.order_token, process.env.JWT_ORDER!)
            const { code } = jwtToken

            const numberVerficationCode = +verficationCode;

            if (code !== numberVerficationCode) {
                return {
                    code: 403,
                    msg: "Order verification failed",
                    error: "Given verification code is incorrect"
                }
            }

            order.order_verified = true;
            await OrderRepository.save(order);

            const orderMealsData = await OrderMealRepository.findBy({ orderId: orderId });

            let totalPriceOfOrder = 0;

            const arrayOfTotalPrices = await Promise.all(orderMealsData.map(async ({ mealId, amount }, index) => {
                const mealData = await MealRepository.findOneBy({ id: mealId });
                if (!mealData) {
                    throw new Error("Meal not found");
                }
                const totalPrice = mealData.price * amount;
                totalPriceOfOrder += totalPrice;
                return `${index + 1}. Meal: ${mealData.title}. Amount: ${amount}. Total Price: ${totalPrice}\n`
            }));

            const botMessage = `*New order recieved!*\nOrder №: ${order.order_id}\nOrder information:\nEmail: ${order.order_email}\nPhone: ${order.order_phone}\nOrdered Meals:\n${arrayOfTotalPrices.join("")}\nTotal price of order: ${totalPriceOfOrder}`

            axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.CHAT_ID,
                text: botMessage,
                parse_mode: "markdown"
            }, {
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })

            return {
                code: 200,
                msg: "Order vefication succeeded"
            }
        } catch (error) {
            let code = 500;
            let errorMsg = "Database/Server-related error";
            const message = "Order verification failed"

            if (error instanceof JsonWebTokenError) {
                code = 400;
                errorMsg = "Given token is expired";
            }

            return {
                code: code,
                msg: message,
                error: errorMsg
            }
        }
    }
}