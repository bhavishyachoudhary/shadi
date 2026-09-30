/** Bandhan Matrimony — MySQL/Sequelize configuration. */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bandhan_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: process.env.DB_LOG_SQL === 'true' ? console.log : false,
    pool: {
      max: Number.parseInt(process.env.DB_POOL_MAX || '5', 10),
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
    define: {
      underscored: true,
      timestamps: true,
      paranoid: false,
    },
  },
);

// Connection lifecycle and readiness are owned by server.js. Keeping this module
// side-effect free avoids duplicate connection attempts during imports and tests.
module.exports = sequelize;
