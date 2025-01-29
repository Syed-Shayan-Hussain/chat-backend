const { joinRoom } = require("../controllers/roomController");
const { sendMessage } = require("../controllers/messageController");

const socketHandlers = (io, socket) => {
  socket.on("join", async ({ username, room }) => {
    try {
      const messages = await joinRoom(room, username);
      socket.join(room);
      socket.emit("previousMessages", messages);
      console.log(`${username} joined room ${room}`);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", error.message);
    }
  });

  socket.on("sendMessage", async ({ room, username, message }) => {
    try {
      await sendMessage(room, username, message);
      io.to(room).emit("receiveMessage", { username, message });
      console.log("Message sent successfully.");
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", "Failed to send message.");
    }
  });
};

module.exports = socketHandlers;
