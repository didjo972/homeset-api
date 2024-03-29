import {validate} from 'class-validator';
import {NextFunction, Request, Response} from 'express';

import {User} from '../entity/user/User';
import {createTokens} from '../middlewares/jwt';
import {IJwtPayload} from '../shared/interfaces';
import {
  IChangePasswordRequest,
  ILoginRequest,
} from '../shared/api-request-interfaces';
import {toUserResponse} from '../transformers/transformers';
import {dataSource} from '../../ormconfig';

class AuthController {
  public static login = async (
    req: Request<any, any, ILoginRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Check if username and password are set
      const {email, password} = req.body;
      if (!email || email === '' || !password || password === '') {
        res.status(400).send();
        return;
      }

      // Get user from database
      const userRepository = dataSource.getRepository(User);
      let user: User;
      try {
        user = await userRepository.findOneOrFail({where: {email}});
      } catch (error) {
        console.error(error);
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
      res.status(200).send(toUserResponse(user));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static changePassword = async (
    req: Request<any, any, IChangePasswordRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Get ID from JWT
      const jwtPayload: IJwtPayload = res.locals.jwtPayload;
      const id = jwtPayload.userId;

      // Get parameters from the body
      const {oldPassword, newPassword} = req.body;
      if (!(oldPassword && newPassword)) {
        res.status(400).send();
      }

      // Get user from the database
      const userRepository = dataSource.getRepository(User);
      let user: User;
      try {
        user = await userRepository.findOneOrFail({where: {id}});
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
    } catch (e) {
      next(e);
    }
  };
}

export default AuthController;
