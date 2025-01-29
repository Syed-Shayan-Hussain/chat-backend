require("dotenv").config();
const app = require("./src/app");
const { initializeSocketServer } = require("./src/socket/socketServer");

const PORT = process.env.PORT || 5000;

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Initialize WebSocket server
initializeSocketServer(server);
