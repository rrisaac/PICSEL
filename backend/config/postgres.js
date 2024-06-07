/**
 * PostgreSQL Connection Module
 * 
 * @description This module is for the connection of the server to the database.
 * @author Rainier Pendon
 * @date 03/16/2024
 * 
 * @description This module has been modified for deployment on Vercel.
 * @author Rheana Mindo
 * @date 03/16/2024
 * 
 * @description This module has been modified again to implement Sequelize for database connection pooling and management.
 * @author Eric Conrad Panga
 * @date 04/03/2024
 * 
 * @description Updated the .env value of the PostgresSQL URL to the second version of the database on Vercel.
 * @author Eric Conrad Panga
 * @date 04/26/2024
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

// Uncomment lines 25-29 if your are using a local database and replace the third argument of the Sequelize constructor with your password. Make sure to comment out lines 32-42.
// const sequelize = new Sequelize('picsel', 'postgres', 'picsel', {
//     host: 'localhost',
//     dialect: 'postgres',
//     logging: console.log,
// });

// Uncomment lines 32-42 if you are using the database on Vercel. Make sure to comment out lines 25-29.
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL successfully!');
    } catch (error) {
        console.error('Unable to connect to PostgreSQL: ', error);
    }
}

testConnection();

module.exports = sequelize;