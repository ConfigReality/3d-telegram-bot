import { Client } from 'pg'

export const useDb = async () => {
    const client = new Client({
        connectionString: process.env.PG_CONNECTION_STRING
    })
    await client.connect()

    await client.query(`
        DROP TABLE IF EXISTS models;
        CREATE TABLE IF NOT EXISTS models (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

    `)

    return client
}