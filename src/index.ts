import dotenv from 'dotenv';
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import {ormconfig} from '../ormconfig';
import Server from './server';

dotenv.config();

const PORT = !Number.isNaN(Number(process.env.PORT))
  ? Number(process.env.PORT)
  : 3000;

// Connect to the database -> then start the express app
createConnection(ormconfig())
  .then(() => {
    Server.runServe(PORT);
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
    // eslint-disable-next-line no-console
    console.log('Could not connect to the database.');
  });
