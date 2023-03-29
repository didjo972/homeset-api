import {Router} from 'express';
import auth from './auth';
import error from './error';
import recipe from './recipe';
import todo from './todo';
import unauth from './unauth';
import user from './user';
import vehicle from './vehicle';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/public', unauth);
routes.use('/todos', todo);
routes.use('/recipes', recipe);
routes.use('/vehicles', vehicle);
routes.use('/', error);

export default routes;
