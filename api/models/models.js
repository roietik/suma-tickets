import Sequelize from 'sequelize';
import dbConfig from '../configs/db.config.js';
import { UserModel } from './user.model.js';

const sequelize = new Sequelize(dbConfig.pgDatabase, dbConfig.pgUser, dbConfig.pgPassword, {
    host: dbConfig.pgHost,
    port: dbConfig.pgPort,
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const models = {
    Sequelize,
    sequelize,
    users: UserModel(sequelize)
};

export default models;