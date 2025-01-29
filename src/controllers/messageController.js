
const { Message } = require("../models");
const { redisPublisher, redisQueueClient } = require("../redis/redisClients");

const sendMessage = async (room, username, message) => {
  // Save the message
  await Message.create({ roomId: room, username, message });

  // Publish to Redis Pub/Sub
  await redisPublisher.publish(
    "chat_channel",
    JSON.stringify({ room, username, message })
  );

  // Add to Redis queue
  await redisQueueClient.rPush(
    "job_queue",
    JSON.stringify({ room, username, message })
  );
};

module.exports = { sendMessage };
