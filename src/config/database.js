import SequelizePkg from 'sequelize';
const Sequelize = SequelizePkg?.Sequelize ?? SequelizePkg;
import { config } from './config.js';

const sequelize = new Sequelize(
  String(config.dbName ?? ''),
  String(config.dbUser ?? ''),
  config.dbPassword == null || config.dbPassword === '' ? null : String(config.dbPassword),
  {
    host: String(config.dbHost ?? 'localhost'),
    port: config.dbPort ? Number(config.dbPort) : 5432,
    dialect: config.dbDialect ?? 'postgres',
    logging: config.env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;