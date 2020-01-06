import { Sequelize } from 'sequelize';
import { Pool } from 'pg';
import './env';

export const database = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: 5432,
  dialect: 'postgres',
});

export const databaseGenerate = () => {
  try {
    const pool = new Pool({
      database: 'postgres',
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      port: 5432,
    });

    pool.query(`CREATE DATABASE IF NOT EXITS ${process.env.DB_NAME}`, (err, res) => {
      database.sync().then(() => {
        console.log('Create Database');
      });
      pool.end();
    });
  } catch (err) {
    console.log(err);
  }
};
