import { Router } from "express";
import auth from "./auth";
import error from "./error";
import home from "./home";
import receip from "./receip";
import todo from "./todo";
import unauth from "./unauth";
import user from "./user";
import vehicle from "./vehicle";

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/public", unauth);
routes.use("/todos", todo);
routes.use("/receips", receip);
routes.use("/vehicles", vehicle);
routes.use("/home", home);
routes.use("/", error);

export default routes;
