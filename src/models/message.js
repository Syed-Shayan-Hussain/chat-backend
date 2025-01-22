module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("Message", {
    roomId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Rooms",
        key: "id",
      },
    },
    username: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.TEXT,
    },
  });

  Message.associate = (models) => {
    Message.belongsTo(models.Room, { foreignKey: "roomId" });
  };

  return Message;
};
