const { body } = require("express-validator");

const validateRole = [
  body("role")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 3 })
    .withMessage("Code must be at least 3 characters long"),
];

module.exports = { validateRole };
