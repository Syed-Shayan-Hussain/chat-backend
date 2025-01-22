const { Room } = require('../models');

const joinRoom = async (username, room) => {
  const existingRoom = await Room.findByPk(room);
  if (existingRoom) {
    if (existingRoom.username !== username) {
      throw new Error('Room already occupied by another user.');
    }
  } else {
    await Room.create({ id: room, username });
  }
};

module.exports = { joinRoom };
