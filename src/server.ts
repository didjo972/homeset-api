import dotenv from "dotenv";
// start the Express server
import { app } from "./app";
const defaultPort = 7000; // default port to listen

class Server {
  public static runServe = (port: number = defaultPort) => {
    dotenv.config();
    port = process.env.nodePort && !Number.isNaN(Number(process.env.nodePort)) ? Number(process.env.nodePort) : port;
    app.listen(port, () => {
      // tslint:disable-next-line:no-console
      console.log("################################################");
      // tslint:disable-next-line:no-console
      console.log(`# Env = ${process.env.NODE_ENV}`);
      // tslint:disable-next-line:no-console
      console.log(`# App name = ${process.env.NODE_APP}`);
      // tslint:disable-next-line:no-console
      console.log(`# Server started at http://localhost:${port}`);
      // tslint:disable-next-line:no-console
      console.log("################################################");
    });
  }
}

export default Server;
