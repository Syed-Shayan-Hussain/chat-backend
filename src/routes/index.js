const express = require("express");
const router = express.Router();

const rolesRouter = require("./roles");
const studentAuthRouter = require("./studentAuth");

router.use("/roles", rolesRouter);
router.use("/auth/student", studentAuthRouter);

module.exports = router;
