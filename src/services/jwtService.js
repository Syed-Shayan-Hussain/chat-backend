require('dotenv').config();
const {sign, verify} = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const JWT_REMEMBER_ME_EXPIRATION = process.env.JWT_REMEMBER_ME_EXPIRATION || '7d';

const generateToken = (payload, rememberMe = false) => {
    const expiration = rememberMe ? JWT_REMEMBER_ME_EXPIRATION : JWT_EXPIRATION;
    return sign(payload, JWT_SECRET, { expiresIn: expiration });
};

const verifyToken = (token) => {
    try {
        return verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const generateRefreshToken = (payload) => {
    return sign(payload, JWT_SECRET, { expiresIn: JWT_REMEMBER_ME_EXPIRATION });
};

module.exports = {
    generateToken,
    verifyToken,
    generateRefreshToken,
};