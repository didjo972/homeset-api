import "reflect-metadata";
import { createConnection } from "typeorm";
import { ormconfig } from "../ormconfig";
import Server from "./server";

const PORT = 3000;

// Connectes to the database -> then start the express app
createConnection(ormconfig)
  .then(async () => {
    Server.runServe(PORT);
  })
  .catch((err) => {
    // tslint:disable-next-line:no-console
    console.error(err);
    // tslint:disable-next-line:no-console
    console.log("Could not connect to the database.");
  });
