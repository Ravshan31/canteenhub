import { DataSource } from "typeorm";
import { Meal } from "./entries/Meal";
import { Day } from "./entries/Day";
import { Category } from "./entries/Category";
import { Admin } from "./entries/Admin";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_URL!,
    database: process.env.DATABASE_NAME!,
    username: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASS!,
    entities: [Meal, Day, Category, Admin],
    synchronize: true,
    logging: false,
})

export const MealRepository = AppDataSource.getRepository(Meal);
export const DayRepository = AppDataSource.getRepository(Day);
export const CategoryRepository = AppDataSource.getRepository(Category);
export const AdminRepository = AppDataSource.getRepository(Admin);