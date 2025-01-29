const express = require("express");
const router = express.Router();

const { getStudentData } = require("../controllers/StudentController");
const { verifyStudent } = require("../middlewares/jwtMiddleware");

router.get("/", verifyStudent, getStudentData);

module.exports = router;