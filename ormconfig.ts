import { ConnectionOptions } from "typeorm";
import { entities } from "./src/entity";

export const ormconfig = (): ConnectionOptions => {
  return {type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: !isNaN(Number(process.env.POSTGRES_PORT)) ? Number(process.env.POSTGRES_PORT) : 15432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  entities,
  migrations: [
    "src/migration/**/.{ts,js}"
  ],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration"
  },
  connectTimeoutMS: 30000,}
};
