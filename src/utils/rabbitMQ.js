const amqp = require('amqplib');
const logger = require('../config/logger');

// Call the connect function
const connectQueue = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const options = { durable: false, autoDelete: true };
    await channel.assertQueue('customer-queue', options);

    return { channel, connection };
  } catch (error) {
    throw new Error(`connection failed ${error}`);
  }
};

const connectQueueCustomer = async (data) => {
  const { channel, connection } = await connectQueue();
  // Send data to queue
  await channel.sendToQueue('customer-queue', Buffer.from(JSON.stringify(data)));

  // Close the channel and connection
  await channel.close();
  await connection.close();
};

const connectQueueClient = async () => {
  const { channel } = await connectQueue();
  channel.consume('customer-queue', (data) => {
    logger.info(Buffer.from(data.content));
  });
};

module.exports = { connectQueueClient, connectQueueCustomer };
