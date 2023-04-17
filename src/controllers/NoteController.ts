import {validate} from 'class-validator';
import {NextFunction, Request, Response} from 'express';
import {Note} from '../entity/notes/Note';
import NoteRepository from '../repositories/NoteRepository';
import Utils from './Utils';
import {User} from '../entity/user/User';
import {
  IUpdateNoteRequest,
  IUpsertNoteRequest,
} from '../shared/api-request-interfaces';
import {toNoteResponse} from '../transformers/transformers';
import GroupRepository from '../repositories/GroupRepository';

class NoteController {
  public static upsertNote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Create or Update Note endpoint has been called with: ' +
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
      const {id, name, data, group} = req.body as IUpsertNoteRequest;

      if (id) {
        // Get the notes from database
        const noteRepository = new NoteRepository();
        let noteToUpdate: Note;
        try {
          noteToUpdate = await noteRepository.getOneById(id, connectedUser.id);
        } catch (e) {
          console.error(e);
          res.status(404).send('Note not found');
          return;
        }

        if (noteToUpdate) {
          console.info('A note has been found: ' + noteToUpdate.id);

          // Check if the user can edit this note
          if (!Utils.hasGrantAccess<Note>(connectedUser, noteToUpdate)) {
            console.error(
              'The connected user has no grant access on this note.',
            );
            res.status(403).send();
            return;
          }

          // Validate the new values on model
          if (name) {
            noteToUpdate.name = name;
          }

          if (data) {
            noteToUpdate.data = data;
          }

          if (group === null || group <= 0) {
            noteToUpdate.group = null;
          } else {
            let groupFound = null;
            const groupRepository = new GroupRepository();
            try {
              groupFound = await groupRepository.getOneById(
                group,
                connectedUser.id,
              );
            } catch (error) {
              console.error(error);
              res.status(404).send('Group not found');
              return;
            }
            noteToUpdate.group = groupFound;
          }

          const errors = await validate(noteToUpdate);
          if (errors.length > 0) {
            res.status(400).send(errors);
            return;
          }

          await noteRepository.save(noteToUpdate);
          res.status(200).send(toNoteResponse(noteToUpdate));
          return;
        }
      }

      const noteToCreate = new Note();
      noteToCreate.name = name;
      noteToCreate.data = data;
      noteToCreate.owner = connectedUser;

      // Validade if the parameters are ok
      const errors = await validate(noteToCreate);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      const noteRepository = new NoteRepository();
      try {
        await noteRepository.save(noteToCreate);
      } catch (e) {
        res.status(400).send('Missing param');
        return;
      }

      // If all ok, send 201 response
      res.status(201).send(toNoteResponse(noteToCreate));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static editNote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Edit Note endpoint has been called with: ' +
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
      const {name, data, group} = req.body as IUpdateNoteRequest;

      // Get the ID from the url
      const id = req.params.id;

      // Get the notes from database
      const noteRepository = new NoteRepository();
      let noteFound: Note;
      try {
        noteFound = await noteRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        // If not found, send a 404 response
        res.status(404).send('Note not found');
        return;
      }

      console.info('A note has been found: ' + noteFound.id);

      // Check if the user can edit this note
      if (!Utils.hasGrantAccess<Note>(connectedUser, noteFound)) {
        console.error('The connected user has no grant access on this note.');
        res.status(403).send();
        return;
      }

      // Validate the new values on model
      if (name && name.length > 3) {
        noteFound.name = name;
      }

      if (group !== undefined) {
        if (group === null || group <= 0) {
          noteFound.group = null;
        } else {
          let groupFound = null;
          const groupRepository = new GroupRepository();
          try {
            groupFound = await groupRepository.getOneById(
              group,
              connectedUser.id,
            );
          } catch (error) {
            console.error(error);
            res.status(404).send('Group not found');
            return;
          }
          noteFound.group = groupFound;
        }
      }

      if (data !== undefined) {
        noteFound.data = data;
      }

      const errors = await validate(noteFound);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      await noteRepository.save(noteFound);
      res.status(200).send(toNoteResponse(noteFound));
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
      console.info('Get all Notes endpoint has been called');

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

      // Get notes from database
      const noteRepository = new NoteRepository();
      try {
        const notes = await noteRepository.findAll(connectedUser.id);
        // Send the todos object
        res.send(notes.map(toNoteResponse));
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
        'Get one Note endpoint has been called with: ' +
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

      // Get the notes from database
      const noteRepository = new NoteRepository();

      let noteFound;
      try {
        noteFound = await noteRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        console.error(error);
        res.status(404).send('Note not found');
      }

      // Check if the user can edit this note
      if (!Utils.hasGrantAccess<Note>(connectedUser, noteFound)) {
        console.error('The connected user has no grant access on this note.');
        res.status(403).send();
        return;
      }

      res.send(toNoteResponse(noteFound));
      return;
    } catch (e) {
      next(e);
    }
  };

  public static deleteNote = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      console.info(
        'Delete a Note endpoint has been called with: ' +
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

      const noteRepository = new NoteRepository();
      let noteFound: Note;
      try {
        noteFound = await noteRepository.getOneById(id, connectedUser.id);
      } catch (error) {
        res.status(404).send('Note not found');
        return;
      }

      // Check if the user can delete this note
      if (!Utils.hasGrantAccess<Note>(connectedUser, noteFound, true)) {
        console.error('The connected user has no grant access on this note.');
        res.status(403).send();
        return;
      }

      await noteRepository.softDelete(noteFound.id);

      // After all send a 204 (no content, but accepted) response
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}

export default NoteController;
