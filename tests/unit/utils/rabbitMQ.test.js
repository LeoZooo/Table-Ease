jest.mock('amqplib');
const amqp = require('amqplib');
const { connectQueueCustomer } = require('../../../src/utils/rabbitMQ');

describe('Queue Tests', () => {
  test('connectQueueCustomer sends data to queue', async () => {
    const mockChannel = {
      assertQueue: jest.fn(),
      sendToQueue: jest.fn(),
      close: jest.fn(),
    };

    const mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
    };

    amqp.connect.mockResolvedValue(mockConnection);

    await connectQueueCustomer({ some: 'data' });

    expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost:5672');
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('customer-queue', { durable: false, autoDelete: true });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith('customer-queue', expect.any(Buffer));
    expect(mockChannel.close).toHaveBeenCalled();
    expect(mockConnection.close).toHaveBeenCalled();
  });
});
