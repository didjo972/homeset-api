import {Response} from 'express';
import {getRepository} from 'typeorm';
import {User} from '../entity/user/User';
import {IJwtPayload} from '../shared/interfaces';
import AbstractBusiness from '../entity/abstract/AbstractBusiness';
import {Group} from '../entity/user/Group';
import {dataSource} from '../../ormconfig';

class Utils {
  public static getUserConnected = async (res: Response): Promise<User> => {
    // Get the user ID from previous midleware
    const {userId} = res.locals.jwtPayload as IJwtPayload;
    const id = userId;

    // Get user from the database
    const userRepository = dataSource.getRepository(User);
    return await userRepository.findOneOrFail({where: {id}});
  };

  // FIXME Type the generic type
  /**
   * Check if a user a grant access on the Todo, Item and Vehicule entities
   *
   * @param connectedUser the user
   * @param businessEntity the entity
   * @param deleteAction
   * @returns a boolean
   */
  public static hasGrantAccess = <T extends AbstractBusiness>(
    connectedUser: User,
    businessEntity: T | any,
    deleteAction = false,
  ): boolean => {
    console.debug('Check grant access delete on this business entity:');
    console.debug(businessEntity);
    if (!deleteAction) {
      return true;
    } else {
      if (businessEntity instanceof Group) {
        return !!businessEntity.users.find(
          (user: User) => user.id === connectedUser.id,
        );
      } else {
        return businessEntity.owner.id === connectedUser.id;
      }
    }
  };
}

export default Utils;
