module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define("Room", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Room.associate = (models) => {
    Room.hasMany(models.Message, { foreignKey: "roomId", onDelete: "CASCADE" });
  };

  return Room;
};
