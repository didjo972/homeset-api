import dotenv from 'dotenv';
import 'reflect-metadata';
import Server from './server';
import {dataSource} from './../ormconfig';

dotenv.config();

const PORT = !Number.isNaN(Number(process.env.PORT))
  ? Number(process.env.PORT)
  : 3000;

// Connect to the database -> then start the express app
// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
dataSource
  .initialize()
  .then(() => {
    Server.runServe(PORT);
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err);
    // eslint-disable-next-line no-console
    console.log('Could not connect to the database.');
  });
