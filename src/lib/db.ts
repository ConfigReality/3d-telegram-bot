import { Client } from 'pg'

export const useDb = async () => {
    const client = new Client({
        connectionString: process.env.PG_CONNECTION_STRING
    })
    await client.connect()

    console.log('Database connected')

    // create users table
    await client.query(`
        DROP TABLE IF EXISTS telegram_users CASCADE;
        CREATE TABLE IF NOT EXISTS telegram_users (
            user_id INT NOT NULL PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            language_code VARCHAR(20),
            type VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `)

    // create models table
    await client.query(`
        DROP TABLE IF EXISTS models CASCADE;
        CREATE TABLE IF NOT EXISTS models (
            model_id VARCHAR(36) NOT NULL PRIMARY KEY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES telegram_users(user_id)
        );
    `)

    // create images table
    await client.query(`
        DROP TABLE IF EXISTS images CASCADE;
        CREATE TABLE IF NOT EXISTS images (
            id SERIAL PRIMARY KEY,
            model_id VARCHAR(36) NOT NULL,
            imgs VARCHAR(1024) ARRAY NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (model_id) REFERENCES models(model_id)
        );
    `)

    console.log('Database created successfully')

    return client
}