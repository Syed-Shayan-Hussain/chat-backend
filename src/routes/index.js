const express = require("express");
const router = express.Router();

const rolesRouter = require("./roles");
const studentAuthRouter = require("./studentAuth");
const studentRouter = require("./student")

router.use("/roles", rolesRouter);
router.use("/auth/student", studentAuthRouter);
router.use("/student", studentRouter);

module.exports = router;
