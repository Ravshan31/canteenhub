import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("orders_meals")
export class OrderMeal {
    @PrimaryGeneratedColumn()
    orderMeals_id!: number;

    @Column()
    orderId!: number;

    @Column()
    mealId!: number;

    @Column()
    amount!: number;
}