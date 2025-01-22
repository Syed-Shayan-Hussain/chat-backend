const { Server } = require('socket.io');
const sequelize = require('./config/database');
const socketHandler = require('./socket/socketHandler');

const PORT = process.env.PORT || 5001;
const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Initialize Socket.IO handlers
socketHandler(io);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
