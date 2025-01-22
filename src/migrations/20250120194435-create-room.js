module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rooms", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true, // Ensure unique room IDs
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true, // Ensure only one user can join the room
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Rooms");
  },
};
