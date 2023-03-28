import {Response} from 'express';
import {getRepository} from 'typeorm';
import {User} from '../entity/User';
import {IJwtPayload} from "../shared/interfaces";

class Utils {
    public static getUserConnected = async (res: Response): Promise<User> => {
        // Get the user ID from previous midleware
        const {userId} = res.locals.jwtPayload as IJwtPayload;
        const id = userId;

        // Get user from the database
        const userRepository = getRepository(User);
        return await userRepository.findOneOrFail(id);
    };
}

export default Utils;
