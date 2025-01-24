const express = require("express");
const router = express.Router();

const { studentRegister, studentLogin, studentLogout } = require("../controllers/StudentController");
const { verifyStudent } = require("../middlewares/jwtMiddleware");

router.post("/register", studentRegister);
router.post("/login", studentLogin);
router.post("/logout", verifyStudent, studentLogout);

module.exports = router;