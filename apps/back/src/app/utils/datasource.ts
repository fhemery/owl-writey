import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const ConnectionData = {
  type: process.env.OWL_DATABASE_TYPE as 'mysql' | 'mariadb',
  host: process.env.OWL_DATABASE_HOST,
  port: parseInt(process.env.OWL_DATABASE_PORT || '3306', 10),
  username: process.env.OWL_DATABASE_USER,
  password: process.env.OWL_DATABASE_PASSWORD,
  database: process.env.OWL_DATABASE_NAME,
  entities: [],
  migrations: process.env.NODE_ENV
    ? []
    : [
        './libs/back/**/migrations/**/*.{js,ts}', // This is for the CLI
      ],
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
};
export const AppDataSource = new DataSource(ConnectionData);
