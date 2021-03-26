const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our db
const sequelize = process.env.JAWSDB_URL
    ? new Sequelize(process.env.JAWSDB_URL)
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'vkh7buea61avxg07.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        dialect: 'mysql',
        port: 3306
    });

module.exports = sequelize;