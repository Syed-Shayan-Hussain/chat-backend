const express = require("express");
const router = express.Router();

const { studentRegister, studentLogin, studentLogout } = require("../controllers/StudentController");
const { verifyStudent } = require("../middlewares/jwtMiddleware");
const { validateStudentRegistration, validateStudentLogin } = require("../middlewares/validators/StudentValidator");

router.post("/register", validateStudentRegistration, studentRegister);
router.post("/login", validateStudentLogin, studentLogin);
router.post("/logout", verifyStudent, studentLogout);

module.exports = router;