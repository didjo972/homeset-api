import { ConnectionOptions } from "typeorm";
import { entities } from "./src/entity";

export const ormconfig: ConnectionOptions = {
  type: "mariadb",
  host: "host.docker.internal",
  port: 3306,
  username: "root",
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
  },
  connectTimeout: 30000,
  acquireTimeout: 30000,
  trace: true
};
