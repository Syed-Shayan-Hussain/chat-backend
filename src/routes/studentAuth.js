const express = require("express");
const router = express.Router();

const { studentRegister } = require("../controllers/StudentController");

router.post("/register", studentRegister);

module.exports = router;