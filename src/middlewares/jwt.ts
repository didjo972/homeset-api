import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';

import {User} from '../entity/user/User';
import {IJwtPayload} from '../shared/interfaces';
import {dataSource} from '../../ormconfig';

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get the jwt token from the head
  let token = req.headers.authorization;
  let jwtPayload;

  // Try to validate the token and get data
  try {
    token = token.startsWith('Bearer ') && token.substring(7);
    jwtPayload = jwt.verify(token, process.env.jwtSecret) as JwtPayload;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // If token is not valid, try to refresh the token
    try {
      let refreshToken: string = req.headers['x-refresh-token'] as string;
      refreshToken =
        refreshToken.startsWith('Bearer ') && refreshToken.substring(7);
      const {newToken, newRefreshToken, userId} = await refreshTokens(
        refreshToken,
      );
      // The token is valid for 5 min
      // We want to send a new token on every request
      res.setHeader('Authorization', `Bearer ${newToken}`);
      res.setHeader('x-refresh-token', `Bearer ${newRefreshToken}`);
      res.locals.jwtPayload = {userId};
    } catch (error2) {
      // If refresh token is not valid, respond with 401 (unauthorized)
      res.status(401).send('You need to connect again.');
      return;
    }
  }

  // Call the next middleware or controller
  next();
};

export const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Get the user ID from previous midleware
    const jwtPayload = res.locals.jwtPayload as IJwtPayload;
    const id = jwtPayload.userId;

    // Get user role from the database
    const userRepository = dataSource.getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({where: {id}});
    } catch (e) {
      res.status(401).send();
    }

    // Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) {
      next();
    } else {
      res.status(401).send();
    }
  };
};

export const createTokens = async (
  user: User,
  secret: string,
  secret2: string,
) => {
  const createToken = jwt.sign(
    {userId: user.id, email: user.email, username: user.username},
    secret,
    {expiresIn: '5m'},
  );

  const refreshToken = jwt.sign({userId: user.id}, secret2, {
    expiresIn: '365d',
  });

  return Promise.all([createToken, refreshToken]);
};

export const refreshTokens = async (refreshToken: string) => {
  let jwtPayload;
  try {
    const data = jwt.decode(refreshToken) as JwtPayload;
    jwtPayload = data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  const {userId} = jwtPayload as {[key: string]: number};
  if (!userId) {
    throw new Error('This user does not exist.');
  }
  const userRepository = dataSource.getRepository(User);
  const user = await userRepository.findOneOrFail({where: {id: userId}});
  if (!user) {
    throw new Error('This user does not exist.');
  }

  jwt.verify(refreshToken, user.refreshSecret);

  const [newToken, newRefreshToken] = await createTokens(
    user,
    process.env.jwtSecret,
    user.refreshSecret,
  );

  return {newToken, newRefreshToken, userId};
};
