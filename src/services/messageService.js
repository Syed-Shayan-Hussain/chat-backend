const { Message } = require('../models');

const saveMessage = async ({ room, username, message }) => {
  return Message.create({ roomId: room, username, message });
};

const fetchMessages = async (room) => {
  return Message.findAll({ where: { roomId: room } });
};

module.exports = { saveMessage, fetchMessages };
