const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");
const config = require("../config/config.json");

// Load the appropriate configuration for the current environment
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const db = {};

// Dynamically load all models in the `models` folder
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Set up model associations (if any)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
