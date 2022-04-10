import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Meal } from "./Meal";

@Entity("categories")
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column()
    slug!: string;

    @OneToMany(() => Meal, meal => meal.category)
    meals!: Meal[]
}