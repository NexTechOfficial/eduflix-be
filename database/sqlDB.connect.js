import { Sequelize } from 'sequelize';
const {DB_NAME,DB_HOST,DB_PASSWORD,DB_PORT,DB_USER,DB_BRAND} = process.env

const DB = new Sequelize({
    host:DB_HOST,
    port:DB_PORT,
    database: DB_NAME,
    dialect: DB_BRAND,
    username: DB_USER,
    password: DB_PASSWORD,
    logging: false,
    pool:{
        max: 10,
        min: 0,
        idle: 10000
    }
  });
export default DB;
// const pool = new Pool({
//     user: DB_USER,
//     host: DB_HOST,
//     database: DB_DATABASE,
//     password: DB_PASSWORD,
//     port: DB_PORT,
//     max: 10, // Set the maximum number of clients in the pool
// });

// async function query(sql, params) {
//     let client;
//     try {

//         // Acquire a client from the pool
//         client = await pool.connect();


//         const result = await client.query(sql, params);


//         return result;
//     } catch (err) {
//         console.error('Error while executing SQL requests: ' + err.toString());
//         return err;
//     } finally {
//         if (client) {
//             // Release the client back to the pool
//             client.release();
//         }
//     }
// }

// module.exports = {
//     query
// }
