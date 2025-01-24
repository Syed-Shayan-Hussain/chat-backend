const { student, user, role } = require("../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { generateToken } = require("../services/jwtService");
const { validationResult } = require("express-validator");
const sequelize = require("../config/database");

const studentRegister = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      // Handle validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        gender,
        phoneNumber,
        dateOfBirth,
        curriculum,
        grade,
      } = req.body;
      console.log(dateOfBirth)
      const existingUser = await user.findOne({ where: { email } });

      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User already exists. Try different email." });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userData = {
        id: uuidv4(),
        email,
        password: hashedPassword,
        role: 1,
      };

      const newUser = await user.create(userData);

      const studentData = {
        id: uuidv4(),
        firstName,
        lastName,
        dateOfBirth,
        phoneNumber,
        gender,
        curriculum,
        grade,
        userId: userData.id,
      };

      const newStudent = await student.create(studentData);

      return res
        .status(201)
        .json({ message: "Student registered successfully" });
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const studentLogin = async (req, res) => {
  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, rememberMe } = req.body;

    const existingUser = await user.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = generateToken(
      { id: existingUser.id, role: existingUser.role, rememberMe },
      rememberMe
    );

    res.cookie("studentToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const studentLogout = async (req, res) => {
  res.clearCookie("studentToken");
  return res.status(200).json({ message: "Logout successful" });
};

const getStudentData = async (req, res) => {
  try {
    const studentData = await student.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: user,
          attributes: { exclude: ["password"] }, // Exclude the password field
          include: [
            {
              model: role,
              as: "userRole", // Use the alias defined in the `user` model association
            },
          ],
        },
      ],
    });

    return res.status(200).json(studentData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  studentRegister,
  studentLogin,
  studentLogout,
  getStudentData,
};
