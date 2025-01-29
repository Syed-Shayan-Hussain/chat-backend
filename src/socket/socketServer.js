const { Server } = require("socket.io");
const socketHandlers = require("./socketHandlers");
const pubsubHandlers = require("./pubsubHandlers");

const initializeSocketServer = (PORT) => {
  const io = new Server(PORT, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socketHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  pubsubHandlers(io);
  return io;
};

module.exports = { initializeSocketServer };
