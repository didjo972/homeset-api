import {NextFunction, Request, Response} from 'express';
import {User} from '../entity/user/User';
import {toGroupResponse} from '../transformers/transformers';
import Utils from './Utils';
import {Group} from '../entity/user/Group';
import {validate} from 'class-validator';
import {
  IMultiDeleteRequest,
  IUpdateGroupRequest,
  IUpsertGroupRequest,
} from '../shared/api-request-interfaces';
import {dataSource} from '../../ormconfig';
import {GroupRepository} from '../repositories/GroupRepository';
import {In} from 'typeorm';

class GroupController {
  public static upsertGroup = async (
    req: Request<any, any, IUpsertGroupRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Create or Update Group endpoint has been called with: %s',
        req.body.toString(),
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get parameters from the body
      const {id, name} = req.body;

      if (id) {
        // Get the groups from database
        let groupToUpdate: Group;
        try {
          groupToUpdate = await GroupRepository.getOneById(
            id,
            connectedUser.id,
          );
        } catch (error) {
          console.error(error);
          res.status(404).send('Group not found');
        }

        if (groupToUpdate) {
          console.info('A group has been found: %d', groupToUpdate.id);

          // Check if the user can edit this group
          if (!Utils.hasGrantAccess<Group>(connectedUser, groupToUpdate)) {
            console.error(
              'The connected user has no grant access on this group.',
            );
            res.status(403).send();
            return;
          }

          // Validate the new values on model
          if (name) {
            groupToUpdate.name = name;
          }

          const errors = await validate(groupToUpdate);
          if (errors.length > 0) {
            res.status(400).send(errors);
            return;
          }
          try {
            await GroupRepository.save(groupToUpdate);
          } catch (e) {
            console.error(e);
            res.status(400).send('Missing param');
            return;
          }
          res.status(200).send(toGroupResponse(groupToUpdate));
          return;
        }
      }

      const groupToCreate = new Group();
      groupToCreate.name = name;
      groupToCreate.owner = connectedUser;
      groupToCreate.users = [connectedUser];

      // Validade if the parameters are ok
      const errors = await validate(groupToCreate);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      try {
        await GroupRepository.save(groupToCreate);
      } catch (e) {
        console.error(e);
        res.status(400).send('Missing param');
        return;
      }

      // If all ok, send 201 response
      res.status(201).send(toGroupResponse(groupToCreate));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static editGroup = async (
    req: Request<{id: number}, any, IUpdateGroupRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Edit Group endpoint has been called with: %s and path param %d',
        req.body.toString(),
        req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get values from the body
      const {name, owner, users} = req.body;

      // Get the ID from the url
      const id = req.params.id;

      // Get the groups from database
      let groupFound: Group;
      try {
        groupFound = await GroupRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('Group not found');
        return;
      }

      console.info('A group has been found: %d', groupFound.id);

      // Check if the user can edit this group
      if (!Utils.hasGrantAccess<Group>(connectedUser, groupFound)) {
        console.error('The connected user has no grant access on this group.');
        res.status(403).send();
        return;
      }

      // Validate the new values on model
      if (name) {
        groupFound.name = name;
      }

      // Get the owner if need
      const userRepository = dataSource.getRepository(User);
      if (owner !== undefined) {
        if (owner === null) {
          groupFound.owner = null;
        } else {
          try {
            const ownerFound = await userRepository.findOneOrFail({
              where: {id: owner.id},
            });
            groupFound.owner = ownerFound;
          } catch (e) {
            console.error(e);
            res.status(404).send("The new owner can't be set.");
            return;
          }
        }
      }

      if (users && users.length >= 0) {
        const updatedTasks = users.map(async userReq => {
          if (userReq.id) {
            const userFound = groupFound.users.find(
              user => user.id === userReq.id,
            );
            if (userFound) {
              return userFound;
            } else {
              try {
                return await userRepository.findOneOrFail({
                  where: {id: userReq.id},
                });
              } catch (e) {
                console.warn("The owner can't be set.");
              }
            }
          }
        });
        groupFound.users = await Promise.all(updatedTasks);
      }

      const errors = await validate(groupFound);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      await GroupRepository.save(groupFound);
      res.status(200).send(toGroupResponse(groupFound));
    } catch (e) {
      next(e);
    }
  };

  public static listAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info('Get all Groups endpoint has been called');

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get groups from database
      try {
        const groups = await GroupRepository.findAll(connectedUser.id);

        // Send the groups object
        res.send(groups.map(group => toGroupResponse(group)));
        return;
      } catch (error) {
        console.error(error);
        res.status(404).send('Not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };

  public static getOneById = async (
    req: Request<{id: number}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Get one Group endpoint has been called with: path param %d',
        req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get the ID from the url
      const id: number = +req.params.id;

      // Get the groups from database
      let groupFound;
      try {
        groupFound = await GroupRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        console.error(error);
        res.status(404).send('Group not found');
      }

      // Check if the user can edit this group
      if (!Utils.hasGrantAccess<Group>(connectedUser, groupFound)) {
        console.error('The connected user has no grant access on this group.');
        res.status(403).send();
        return;
      }
      res.send(toGroupResponse(groupFound));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static deleteGroup = async (
    req: Request<{id: number}>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Delete a Group endpoint has been called with: path param %d',
        req.params.id,
      );

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get the ID from the url
      const id = req.params.id;

      let groupFound: Group;
      try {
        groupFound = await GroupRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        res.status(404).send('Todo not found');
        return;
      }

      // Check if the user can delete this todo
      if (!Utils.hasGrantAccess<Group>(connectedUser, groupFound, true)) {
        console.error('The connected user has no grant access on this group.');
        res.status(403).send();
        return;
      }

      await GroupRepository.softDelete(groupFound.id);

      // After all send a 204 (no content, but accepted) response
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  public static multiDelete = async (
    req: Request<any, any, IMultiDeleteRequest[]>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info('Delete Groups endpoint has been called');

      // Get the connected user
      let connectedUser: User;
      try {
        connectedUser = await Utils.getUserConnected(res);
        console.info(
          `The user ${connectedUser.username} is known and connected`,
        );
      } catch (e) {
        res.status(401).send();
        return;
      }

      // Get values from the body
      const idsReq = req.body;

      const ids = idsReq.map(item => item.id);

      // Get the groups from database
      let groupsFound: Group[];
      try {
        groupsFound = await GroupRepository.findBy([
          {
            id: In(ids),
            owner: {id: connectedUser.id},
          },
        ]);
        // TODO Check if we should call hasGrantAccess
        await GroupRepository.softDelete(groupsFound.map(group => group.id));
        res.status(204).send();
        return;
      } catch (error) {
        console.error(error);
        // If not found, send a 404 response
        res.status(404).send('Group not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };
}

export default GroupController;
