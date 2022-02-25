import { ConnectionOptions } from "typeorm";
import { entities } from "./src/entity";

export const ormconfig: ConnectionOptions = {
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "homeset",
  password: "648d005a",
  database: "homeset",
  synchronize: true,
  logging: true,
  entities,
  migrations: [
    "src/migration/**/.{ts,js}"
  ],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration"
  }
};
