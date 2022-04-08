import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_URL!,
    database: process.env.DATABASE_NAME!,
    username: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASS!,
    entities: [],
    synchronize: true,
    logging: false,
})

export { AppDataSource };