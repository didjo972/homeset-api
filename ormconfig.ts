import dotenv from 'dotenv';
import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {entities} from './src/entity';

dotenv.config();

const AppDataSource = (): DataSource => {
  return new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: !isNaN(Number(process.env.POSTGRES_PORT))
      ? Number(process.env.POSTGRES_PORT)
      : 15432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities,
    synchronize: true,
    logging: false,
    connectTimeoutMS: 30000,
  });
};

export const dataSource = AppDataSource();
