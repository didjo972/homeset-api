import {validate} from 'class-validator';
import {NextFunction, Request, Response} from 'express';

import {User} from '../entity/user/User';
import {MailError} from '../shared/errors/MailError';
import {
  ICreateUserRequest,
  IResetPasswordRequest,
} from '../shared/api-request-interfaces';
import {mailService} from '../shared/mail';
import {UserRepository} from '../repositories/UserRepository';

class UnauthController {
  public static helloWorld = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.json({message: 'Hello World !'});
    } catch (e) {
      next(e);
    }
  };

  public static ping = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({isAlive: true});
    } catch (e) {
      next(e);
    }
  };

  public static newUser = async (
    req: Request<any, any, ICreateUserRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // Get parameters from the body
      const {username, password, email} = req.body;
      const user = new User();
      user.username = username;
      user.password = password;
      user.email = email;
      user.role = 'USER';

      // Validade if the parameters are ok
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      // Hash the password, to securely store on DB
      user.hashPassword();

      // Create the refresh secret
      user.createOrUpdateRefreshSecret();

      // Try to save. If fails, the username is already in use
      try {
        await UserRepository.save(user);
      } catch (e) {
        res.status(409).send('username already in use');
        return;
      }

      // If all ok, send 201 response
      res.status(201).send('User created');
    } catch (e) {
      next(e);
    }
  };

  public static resetPassword = async (
    req: Request<any, any, IResetPasswordRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const {email} = req.body;
      if (!email) {
        res.status(400).send('Email is missing');
        return;
      }

      // Get the user by email
      try {
        const userFound = await UserRepository.createQueryBuilder('user')
          .where('user.email = :email', {email})
          .getOne();

        // Send an email with an URL to reset the password
        mailService.sendResetPasswordMail(userFound.email);
        res.status(204).send();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        if (e instanceof MailError) {
          next(e);
          return;
        } else {
          res.status(400).send("This email doesn't exist");
          return;
        }
      }
    } catch (e) {
      next(e);
    }
  };
}

export default UnauthController;
