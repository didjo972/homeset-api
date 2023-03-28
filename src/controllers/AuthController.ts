import {validate} from 'class-validator';
import {Request, Response} from 'express';
import {getRepository} from 'typeorm';

import {User} from '../entity/User';
import {createTokens} from '../middlewares/jwt';
import {IChangePasswordRequest, IJwtPayload, ILoginRequest} from '../shared/interfaces';

class AuthController {
    public static login = async (req: Request, res: Response) => {
        // Check if username and password are set
        const {email, password} = req.body as ILoginRequest;
        if (!email || email === '' || !password || password === '') {
            res.status(400).send();
            return;
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail({where: {email}});
        } catch (error) {
            res.status(401).send();
            return;
        }

        // Check if encrypted password match
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).send();
            return;
        }

        // Sing JWT, valid for 1 hour
        const [token, refreshToken] = await createTokens(
            user,
            process.env.jwtSecret,
            user.refreshSecret,
        );

        // Send the jwt in the response
        res.setHeader('Authorization', 'Bearer ' + token);
        res.setHeader('x-refresh-token', 'Bearer ' + refreshToken);
        res.status(200).send({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        });
        return;
    };

    public static changePassword = async (req: Request, res: Response) => {
        // Get ID from JWT
        const jwtPayload = res.locals.jwtPayload as IJwtPayload;
        const id = jwtPayload.userId;

        // Get parameters from the body
        const {oldPassword, newPassword}: IChangePasswordRequest = req.body as IChangePasswordRequest;
        if (!(oldPassword && newPassword)) {
            res.status(400).send();
        }

        // Get user from the database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            res.status(401).send();
        }

        // Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        // Validate the model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        // Hash the new password, create the new refresh secret and save
        user.hashPassword();
        user.createOrUpdateRefreshSecret();
        await userRepository.save(user);

        res.status(204).send();
    };
}

export default AuthController;
