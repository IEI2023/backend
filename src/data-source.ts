import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
dotenv.config();

const loggingEnabled = process.env.LOGGING_ENABLED === "true";
const synchronizeEnabled = process.env.SYNCRONIZE_ENABLED === "true";
const port = parseInt(process.env.MYSQL_PORT);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: port || 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: synchronizeEnabled,
  logging: loggingEnabled,
  entities: [process.env.ENTITIES_PATH],
  migrations: [],
  subscribers: [],
});
