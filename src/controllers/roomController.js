const { Room, Message } = require("../models");

const joinRoom = async (room, username) => {
  const existingRoom = await Room.findByPk(room);

  if (existingRoom && existingRoom.username !== username) {
    throw new Error("Room already occupied by another user.");
  }

  if (!existingRoom) {
    await Room.create({ id: room, username });
  }

  const messages = await Message.findAll({ where: { roomId: room } });
  return messages;
};

module.exports = { joinRoom };
