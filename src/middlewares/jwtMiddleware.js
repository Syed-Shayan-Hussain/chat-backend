const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { role } = require("../models");
const { user } = require("../models");

const verifyToken = promisify(jwt.verify);
const signToken = promisify(jwt.sign);

const verifyStudent = async (req, res, next) => {
  const token = req.cookies?.studentToken;

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }

  try {
    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    const userItem = await user.findByPk(decoded.id);

    const roleItem = await role.findByPk(userItem.role);
    
    if (roleItem?.code !== "STD") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newToken = await signToken(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: decoded.rememberMe
          ? process.envprocess.env.JWT_REMEMBER_ME_EXPIRATION
          : process.env.JWT_EXPIRATION,
      }
    );
    res.cookie("studentToken", newToken, { httpOnly: true });

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyStudent };
