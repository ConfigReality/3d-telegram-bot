import { Client } from 'pg'

export const useDb = async () => {
    const client = new Client({
        connectionString: process.env.PG_CONNECTION_STRING,
        keepAlive: true
    })
    try {
        await client.connect()
    } catch (error) {
        setTimeout(() => {
            process.exit(1)
        }, 500);
    }

    client.on('error', (err) => {
        console.error('Database error', err)
        setTimeout(() => {
            process.exit(1)
        }, 500);
    })

    console.log('Database connected')

    // create users table
    // DROP TABLE IF EXISTS telegram_users CASCADE;
    await client.query(`
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
    // await client.query('DROP TABLE IF EXISTS models CASCADE;');
    await client.query(`
        CREATE TABLE IF NOT EXISTS models (
            model_id VARCHAR(36) NOT NULL PRIMARY KEY,
            imgs VARCHAR(1024) ARRAY,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES telegram_users(user_id)
        );
    `)

    // create images table
    // await client.query('DROP TABLE IF EXISTS images CASCADE;')
    // await client.query(`
    //     CREATE TABLE IF NOT EXISTS images (
    //         id SERIAL PRIMARY KEY,
    //         model_id VARCHAR(36) NOT NULL,
    //         imgs VARCHAR(1024) ARRAY NOT NULL,
    //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //         FOREIGN KEY (model_id) REFERENCES models(model_id)
    //     );
    // `)

    // create processing table
    // await client.query('DROP TABLE IF EXISTS processing CASCADE;');
    await client.query(`
        CREATE TABLE IF NOT EXISTS processing (
            id SERIAL PRIMARY KEY,
            model_id VARCHAR(36) NOT NULL,
            model_url VARCHAR(1024),
            model_detail VARCHAR(20) NOT NULL,
            model_order VARCHAR(20) NOT NULL,
            model_feature VARCHAR(20) NOT NULL,
            status VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (model_id) REFERENCES models(model_id)
        );
    `)

    console.log('Database created successfully')
    return client
}