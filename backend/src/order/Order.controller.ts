import { Response } from "express";
import { Body, JsonController, Post, Res } from "routing-controllers";
import { OrderService } from "./Order.service";
import { IBaseReturnData, IReturnMealOrder, VAddOrderDTO, VVerifyOrderDTO } from "./Order.interface";

@JsonController("/orders")
export class OrderController {
    @Post("/add")
    async addNewOrder(@Body() orderDTO: VAddOrderDTO, @Res() res: Response): Promise<IReturnMealOrder> {
        if (process.env.NODE_ENV !== "dev") {
            const { email } = orderDTO;
            if (!email.includes("@webster.edu")) {
                res.status(400);
                return {
                    code: 400,
                    msg: "Order failed",
                    error: "Given email is not Webster University email"
                }
            }
        }

        const data = await OrderService.addNewOrder(orderDTO);
        res.status(data.code);

        return data;
    }

    @Post("/verify-new")
    async verifyNewOrder(@Body() orderDTO: VVerifyOrderDTO, @Res() res: Response): Promise<IBaseReturnData> {
        const data = await OrderService.verifyNewOrder(orderDTO)
        res.status(data.code);

        return data;
    }

    async getOrderById() {
        // TODO: Do it lated
    }

    async getAllOrders() {
        // TODO: Do it lated
    }
}
