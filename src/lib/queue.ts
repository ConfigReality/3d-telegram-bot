import amqp from 'amqplib/callback_api'
import { config } from 'dotenv'
config()
const connectionString = process.env.QUEUE_CONNECTION_STRING || 'amqp://localhost'
export const sendToQueue = (message: number) => {
    amqp.connect(connectionString, (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            const queue = 'processing';
            const msg = message;

            channel.assertQueue(queue, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(message.toString()));
            console.log(`[x] Sent ${msg}`);
        });
        setTimeout(() => {
            connection.close();
        }, 500);
    });
}