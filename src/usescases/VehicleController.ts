import {NextFunction, Request, Response} from 'express';
import {User} from '../entity/user/User';
import Utils from './Utils';
import {Vehicle} from '../entity/garage/Vehicle';
import {VehicleRepository} from '../repositories/VehicleRepository';
import {
  IActRequest,
  IMultiDeleteRequest,
  IServicingRequest,
  IVehicleRequest,
} from '../shared/api-request-interfaces';
import {validate} from 'class-validator';
import {toVehicleResponse} from '../transformers/transformers';
import {matchRequestSubItemsInItemEntity, selectGroup} from './Helpers';
import {In} from 'typeorm';
import {Servicing} from '../entity/garage/Servicing';
import {Act} from '../entity/garage/Act';

class VehicleController {
  private static matchServicing = (
    vehicle: Vehicle,
    servicingReq: IServicingRequest,
  ): Servicing => {
    if (servicingReq.id) {
      const servicingFound = vehicle.servicings.find(
        item => item.id === servicingReq.id,
      );
      if (servicingFound) {
        if (servicingReq.kilometer) {
          servicingFound.kilometer = servicingReq.kilometer;
        }
        if (servicingReq.acts !== undefined) {
          servicingFound.acts = matchRequestSubItemsInItemEntity<
            Servicing,
            IActRequest,
            Act
          >(servicingFound, servicingReq.acts, VehicleController.matchAct);
        }
        return servicingFound;
      }
    }

    if (servicingReq.kilometer) {
      return new Servicing(servicingReq);
    }
  };

  private static matchAct = (
    servicing: Servicing,
    actReq: IActRequest,
  ): Act => {
    if (actReq.id) {
      const actFound = servicing.acts.find(item => item.id === actReq.id);
      if (actFound) {
        if (actReq.description) {
          actFound.description = actReq.description;
        }
        if (actReq.comment) {
          actFound.comment = actReq.comment;
        }
        return actFound;
      }
    }

    if (actReq.description) {
      return new Act(actReq);
    }
  };

  public static upsertVehicule = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Create or Update Vehicule endpoint has been called with: ' +
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
      const {id, brand, model, identification, group, servicings} =
        req.body as IVehicleRequest;

      if (id) {
        // Get the notes from database
        let vehicleToUpdate: Vehicle;
        try {
          vehicleToUpdate = await VehicleRepository.getOneById(
            id,
            connectedUser.id,
          );
        } catch (e) {
          console.error(e);
          res.status(404).send('Vehicle not found');
          return;
        }

        if (vehicleToUpdate) {
          console.info('A vehicle has been found: ' + vehicleToUpdate.id);

          // Check if the user can edit this vehicle
          if (!Utils.hasGrantAccess<Vehicle>(connectedUser, vehicleToUpdate)) {
            console.error(
              'The connected user has no grant access on this vehicle.',
            );
            res.status(403).send();
            return;
          }

          // Validate the new values on model
          if (brand) {
            vehicleToUpdate.brand = brand;
          }

          if (model) {
            vehicleToUpdate.model = model;
          }

          if (identification) {
            vehicleToUpdate.identification = identification;
          }

          if (servicings) {
            vehicleToUpdate.servicings = matchRequestSubItemsInItemEntity<
              Vehicle,
              IServicingRequest,
              Servicing
            >(vehicleToUpdate, servicings, VehicleController.matchServicing);
          }

          if (group !== undefined) {
            try {
              vehicleToUpdate.group = await selectGroup(
                group,
                connectedUser.id,
              );
            } catch (error) {
              console.error(error);
              res.status(404).send('Group not found');
              return;
            }
          }

          const errors = await validate(vehicleToUpdate);
          if (errors.length > 0) {
            res.status(400).send(errors);
            return;
          }

          await VehicleRepository.save(vehicleToUpdate);
          res.status(200).send(toVehicleResponse(vehicleToUpdate));
          return;
        }
      }

      const vehicleToCreate = new Vehicle();
      if (brand) {
        vehicleToCreate.brand = brand;
      }

      if (model) {
        vehicleToCreate.model = model;
      }

      if (identification) {
        vehicleToCreate.identification = identification;
      }

      if (group !== undefined) {
        try {
          vehicleToCreate.group = await selectGroup(group, connectedUser.id);
        } catch (error) {
          console.error(error);
          res.status(404).send('Group not found');
          return;
        }
      }

      vehicleToCreate.owner = connectedUser;

      // Validade if the parameters are ok
      const errors = await validate(vehicleToCreate);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      try {
        await VehicleRepository.save(vehicleToCreate);
      } catch (e) {
        res.status(400).send('Missing param');
        return;
      }

      // If all ok, send 201 response
      res.status(201).send(toVehicleResponse(vehicleToCreate));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static editVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Edit Vehicle endpoint has been called with: ' +
          req.body.toString() +
          ' and path param ' +
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
      const {brand, model, identification, servicings, group} =
        req.body as IVehicleRequest;

      // Get the ID from the url
      const id = req.params.id;

      // Get the vehicle from database
      let vehicleFound: Vehicle;
      try {
        vehicleFound = await VehicleRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('Vehicle not found');
        return;
      }

      console.info('A vehicle has been found: ' + vehicleFound.id);

      // Check if the user can edit this vehicle
      if (!Utils.hasGrantAccess<Vehicle>(connectedUser, vehicleFound)) {
        console.error(
          'The connected user has no grant access on this vehicle.',
        );
        res.status(403).send();
        return;
      }

      // Validate the new values on model
      if (brand) {
        vehicleFound.brand = brand;
      }

      if (model) {
        vehicleFound.model = model;
      }

      if (identification) {
        vehicleFound.identification = identification;
      }

      if (servicings) {
        vehicleFound.servicings = matchRequestSubItemsInItemEntity<
          Vehicle,
          IServicingRequest,
          Servicing
        >(vehicleFound, servicings, VehicleController.matchServicing);
      }

      if (group !== undefined) {
        try {
          vehicleFound.group = await selectGroup(group, connectedUser.id);
        } catch (error) {
          console.error(error);
          res.status(404).send('Group not found');
          return;
        }
      }

      const errors = await validate(vehicleFound);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      await VehicleRepository.save(vehicleFound);
      res.status(200).send(toVehicleResponse(vehicleFound));
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
      console.info('Get all Vehicles endpoint has been called');

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

      // Get vehicles from database
      try {
        const notes = await VehicleRepository.findAll(connectedUser.id);
        // Send the vehicles object
        res.send(notes.map(toVehicleResponse));
        return;
      } catch (e) {
        console.error(e);
        res.status(404).send('Not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };

  public static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Get one Vehicle endpoint has been called with: ' +
          'path param ' +
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

      // Get the vehicle from database
      let vehicleFound;
      try {
        vehicleFound = await VehicleRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        console.error(error);
        res.status(404).send('Vehicle not found');
      }

      // Check if the user can edit this vehicle
      if (!Utils.hasGrantAccess<Vehicle>(connectedUser, vehicleFound)) {
        console.error(
          'The connected user has no grant access on this vehicle.',
        );
        res.status(403).send();
        return;
      }

      res.send(toVehicleResponse(vehicleFound));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static deleteVehicle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Delete a Vehicle endpoint has been called with: ' +
          'path param ' +
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

      let vehicleFound: Vehicle;
      try {
        vehicleFound = await VehicleRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        res.status(404).send('Note not found');
        return;
      }

      // Check if the user can delete this vehicle
      if (!Utils.hasGrantAccess<Vehicle>(connectedUser, vehicleFound, true)) {
        console.error(
          'The connected user has no grant access on this vehicle.',
        );
        res.status(403).send();
        return;
      }

      await VehicleRepository.softDelete(vehicleFound.id);

      // After all send a 204 (no content, but accepted) response
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };

  public static multiDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info('Delete Vehicles endpoint has been called');

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
      const idsReq = req.body as IMultiDeleteRequest[];

      const ids = idsReq.map(item => item.id);

      // Get the notes from database
      let vehiclesFound: Vehicle[];
      try {
        vehiclesFound = await VehicleRepository.findBy([
          {
            id: In(ids),
            owner: {id: connectedUser.id},
          },
          {
            id: In(ids),
            group: {users: {id: connectedUser.id}},
          },
        ]);
        // TODO Check if we should call hasGrantAccess
        await VehicleRepository.softDelete(
          vehiclesFound.map(vehicle => vehicle.id),
        );
        res.status(204).send();
        return;
      } catch (error) {
        console.error(error);
        // If not found, send a 404 response
        res.status(404).send('Vehicles not found');
        return;
      }
    } catch (e) {
      next(e);
    }
  };
}

export default VehicleController;
