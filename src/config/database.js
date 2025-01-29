require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_DATABASE, process.env.PG_USER, process.env.PG_PASSWORD, {
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'postgres',
});

module.exports = sequelize;
