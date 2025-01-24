const express = require('express');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const sequelize = require('./config/database');
const socketHandler = require('./socket/socketHandler');

const PORT = process.env.SOCKET_PORT || 5001;

const app = express();
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Initialize Socket.IO handlers
socketHandler(io);

// API Routes
app.use('/api', require('./routes/index'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = app;

