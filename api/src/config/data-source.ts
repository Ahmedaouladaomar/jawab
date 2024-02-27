import * as dotenv from 'dotenv';
import { DataSource } from "typeorm";

dotenv.config({ path: '.env' })

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true, 
    entities: ['src/../entities/*{.ts,.js}'],
    migrations: ['migrations/*{.ts,.js}'],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })