import amqp from 'amqp'
require('dotenv').config();

export const connection = amqp.createConnection({
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
