import {dataSource} from '../../ormconfig';
import {User} from '../entity/user/User';

export const UserRepository = dataSource.getRepository(User);
