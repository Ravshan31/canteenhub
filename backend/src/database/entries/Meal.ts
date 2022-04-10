import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { Day } from "./Day";

@Entity("meals")
export class Meal {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    imageUrl!: string;

    @Column({ length: 500 })
    description!: string;

    @Column()
    price!: number;

    @Column()
    isAvailable!: boolean;

    @ManyToOne(() => Category, category => category.meals)
    category!: Category;

    @ManyToMany(() => Day)
    @JoinTable({
        name: "meals_days",
        joinColumn: {
            name: "mealId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "dayId",
            referencedColumnName: "id"
        }
    })
    days!: Day[]
}