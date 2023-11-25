import { Pool } from 'pg'

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10, // Set the maximum number of clients in the pool
});

async function query(sql, params) {
    let client;
    try {

        // Acquire a client from the pool
        client = await pool.connect();


        const result = await client.query(sql, params);


        return result;
    } catch (err) {
        console.error('Error while executing SQL requests: ' + err.toString());
        return err;
    } finally {
        if (client) {
            // Release the client back to the pool
            client.release();
        }
    }
}

module.exports = {
    query
}
