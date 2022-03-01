import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

class Utils {
  public static getUserConnected = async (res: Response): Promise<User> => {
    // Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    // Get user from the database
    const userRepository = getRepository(User);
    return await userRepository.findOneOrFail(id);
  }
}

export default Utils;
