import amqp from 'amqp'


require('dotenv').config();

export const useQueue = () => {
    let client = null;
    try {
        const connection = amqp.createConnection({
            url: process.env.QUEUE_CONNECTION_STRING,
            reconnect: false
        });
        connection.on('ready', () => {
            console.log('Queue connected')
        });
        connection.on('error', (error) => {
            console.error('Queue error', error)
        });
        connection.on('close', () => {
            console.log('Queue closed')
        });
        client =  connection;
        
    } catch (error) {
        console.log('Queue error', error)
    }
    return client;
}