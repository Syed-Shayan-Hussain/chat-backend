const { redisSubscriber } = require("../redis/redisClients");
const { Message } = require("../models");

const pubsubHandlers = async (io) => {
  await redisSubscriber.subscribe("chat_responses", async (message) => {
    const parsedMessage = JSON.parse(message);

    io.to(parsedMessage.room).emit("receiveMessage", {
      username: "Server",
      message: parsedMessage.response,
    });

    try {
      await Message.create({
        roomId: parsedMessage.room,
        username: "Server",
        message: parsedMessage.response,
      });
    } catch (error) {
      console.error("Error saving server response:", error);
    }
  });
};

module.exports = pubsubHandlers;
