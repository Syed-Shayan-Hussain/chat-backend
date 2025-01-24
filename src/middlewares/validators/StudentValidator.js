const { body } = require("express-validator");
const moment = require("moment");

const validateStudentRegistration = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),
  body("phoneNumber").isMobilePhone().withMessage("Invalid phone number"),
  body("dateOfBirth").custom((value) => {
    const formats = ["YYYY-MM-DD", "MM/DD/YYYY", "DD-MM-YYYY", "MM-DD-YYYY"];
    if (!moment(value, formats, true).isValid()) {
      throw new Error(
        "Invalid date of birth format. Accepted formats: YYYY-MM-DD, MM/DD/YYYY, DD-MM-YYYY, MM-DD-YYYY"
      );
    }
    return true;
  }),

  //   body("curriculum").notEmpty().withMessage("Curriculum is required"),
  //   body("grade")
  //     .isInt({ min: 1 })
  //     .withMessage("Grade must be a positive integer"),
];

const validateStudentLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("rememberMe").isBoolean().withMessage("Invalid remember_me value"),
];

module.exports = {
  validateStudentRegistration,
  validateStudentLogin,
};
