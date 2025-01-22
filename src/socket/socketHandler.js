const { Room, Message } = require('../models');
const redisPublisher = require('../redis/publisher');
const redisSubscriber = require('../redis/subscriber');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', async ({ username, room }) => {
        try {
            const existingRoom = await Room.findByPk(room);
      
            if (existingRoom) {
              if (existingRoom.username !== username) {
                return socket.emit("error", "Room already occupied by another user.");
              }
            } else {
              await Room.create({ id: room, username });
            }
      
            socket.join(room);
            console.log(`${username} joined room ${room}`);
      
            // Fetch previous messages for the room
            const messages = await Message.findAll({ where: { roomId: room } });
            socket.emit("previousMessages", messages);
          } catch (error) {
            console.error("Error joining room:", error);
            socket.emit("error", "Failed to join room.");
          }
    });

    socket.on('sendMessage', async (message) => {
      try {
            const { room, username, message: text } = message;
      
            // Save the message to the database
            await Message.create({ roomId: room, username, message: text });
      
            // Add job to Redis queue for processing
            await redisPublisher.rPush("job_queue", JSON.stringify(message));
            console.log("Message added to Redis queue:", message);
      
            // Broadcast the message to other clients in the room
            io.to(room).emit("receiveMessage", {
              username,
              message: text,
            });
          } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("error", "Failed to send message.");
          }
    });

    socket.on('fetchMessages', async (room) => {
        try {
            const messages = await Message.findAll({ where: { roomId: room } });
            socket.emit("previousMessages", messages);
          } catch (error) {
            console.error("Error fetching messages:", error);
            socket.emit("error", "Failed to fetch messages.");
          }
    });

    redisSubscriber.subscribe('chat_responses', (message) => {
      const parsedMessage = JSON.parse(message);
      io.to(parsedMessage.room).emit('receiveMessage', {
        username: 'Server',
        message: parsedMessage.response,
      });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
