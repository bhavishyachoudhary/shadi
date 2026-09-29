/**
 * Bandhan Matrimony — MySQL Database Configuration
 * Using Sequelize ORM with mysql2 driver
 * Optimized for GoDaddy Shared Hosting cPanel MySQL
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bandhan_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
    define: {
      underscored: true,       // Use snake_case column names
      timestamps: true,        // createdAt, updatedAt auto-managed
      paranoid: false,
    }
  }
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error.message);
  }
};

testConnection();

module.exports = sequelize;
