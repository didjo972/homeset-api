import {validate} from 'class-validator';
import {Request, Response} from 'express';
import {Like, getRepository} from 'typeorm';
import {User} from '../entity/user/User';
import {IEditUserRequest} from '../shared/api-request-interfaces';
import {toUserResponse} from '../transformers/transformers';

class UserController {
  public static listAll = async (req: Request, res: Response) => {
    console.info(
      'Get all Users endpoint has been called with');

    // Get users from database
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'username', 'role'], // We dont want to send the passwords on response
    });

    // Send the users object
    res.status(200).send(users.map(user => toUserResponse(user)));
  };

  public static getOneById = async (req: Request, res: Response) => {
    console.info(
      'Get one User endpoint has been called with: ' +
        'path param ' +
        req.params.id,
    );

    // Get the ID from the url
    const id: number = +req.params.id;

    // Get the user from database
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ['id', 'username', 'role', 'phone'], // We dont want to send the password on response
      });
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(404).send('User not found');
    }
  };

  public static findsByUsername = async (req: Request, res: Response) => {
    console.info(
      'Finds by username a User endpoint has been called with: ' +
        'path param ' +
        req.query,
    );

    // Get the username from the url
    const search = req.query['username'] as string;

    if (!search && search.length < 3) {
      res.status(400).send('The search is incorrect');
      return;
    }

    // Get the user from database
    const userRepository = getRepository(User);
    try {
      const users = await userRepository.find({where: {username: Like(`%${search}%`)}, select: ['id', 'username', 'role', 'phone']})
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(404).send('Users not found');
    }
    return;
  };

  public static editUser = async (req: Request, res: Response) => {
    console.info(
      'Edit a User endpoint has been called with: ' +
        'path param ' +
        req.params.id,
    );

    // Get the ID from the url
    const id = req.params.id;

    // Get values from the body
    const {username, role, phone} = req.body as IEditUserRequest;

    // Try to find user on database
    const userRepository = getRepository(User);
    let user;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      console.error(error);
      // If not found, send a 404 response
      res.status(404).send('User not found');
      return;
    }

    // Validate the new values on model
    if (phone) {
      user.phone = phone;
    }

    if (username) {
      user.username = username;
    }

    if (role) {
      user.role = role;
    }
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    // Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send('username already in use');
      return;
    }
    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  public static deleteUser = async (req: Request, res: Response) => {
    console.info(
      'Delete a User endpoint has been called with: ' +
        'path param ' +
        req.params.id,
    );

    // Get the ID from the url
    const id = req.params.id;

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send('User not found');
      return;
    }
    await userRepository.delete(user.id);

    // After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };
}

export default UserController;
