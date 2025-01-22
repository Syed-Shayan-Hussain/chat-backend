const redis = require("redis");
const { Server } = require("socket.io");
const { sequelize, Room, Message } = require("./models"); // Import Sequelize models

const PORT = 5000;

// Initialize Socket.IO
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Redis clients for publishing and subscribing
const redisSubscriber = redis.createClient();
const redisPublisher = redis.createClient();

// Connect Redis clients
redisSubscriber.connect();
redisPublisher.connect();

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle room joining
  socket.on("join", async ({ username, room }) => {
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

  // Handle message sending
  socket.on("sendMessage", async (message) => {
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

  // Handle fetching messages
  socket.on("fetchMessages", async (room) => {
    try {
      const messages = await Message.findAll({ where: { roomId: room } });
      socket.emit("previousMessages", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      socket.emit("error", "Failed to fetch messages.");
    }
  });

  // Listen for Redis messages from 'chat_responses' channel
  redisSubscriber.subscribe("chat_responses", (message) => {
    const parsedMessage = JSON.parse(message);
    console.log("Received processed message from Redis:", parsedMessage);

    // Emit the message to the specific room
    io.to(parsedMessage.room).emit("receiveMessage", {
      username: "Server",
      message: parsedMessage.response,
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server and test DB connection
(async () => {
  try {
    await sequelize.authenticate(); // Test database connection
    console.log("Database connected successfully!");

  
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
