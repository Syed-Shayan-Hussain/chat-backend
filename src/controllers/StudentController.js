const { student, user } = require("../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
// const { body, validationResult } = require("express-validator");

const studentRegister = async (req, res) => {
  try {
    const {
      email,
      password,
      confirm_password,
      first_name,
      last_name,
      gender,
      phone_number,
      date_of_birth,
      curriculum,
      grade,
    } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = uuidv4();

    const userData = {
      id: userId,
      email,
      password: hashedPassword,
      role: 1,
    };

    const newUser = await user.create(userData);

    const studentData = {
      id: uuidv4(),
      first_name,
      last_name,
      date_of_birth,
      phone_number,
      gender,
      curriculum,
      grade,
      user_id: userId,
    };

    const newStudent = await student.create(studentData);

    return res.status(201).json(newUser, newStudent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { studentRegister };
