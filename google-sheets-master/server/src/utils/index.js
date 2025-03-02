const { sign, JsonWebTokenError } = require("jsonwebtoken");
const colors = [
  "#EF4770", "#6F6F6F", "#DCB604", "#199393", "#029ACD",
  "#11C1DA", "#3B8FFC", "#18C6A0", "#B387FF", "#F75334"
];

class CustomError extends Error {
  constructor({ message, status }) {
    super(message);
    this.status = status;
  }
}

const asyncHandler = (cb) => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      let status = error?.status || (error instanceof JsonWebTokenError ? 401 : 500);
      let message = error?.message || "Internal Server Error";

      res.status(status).send({ message });
      console.log("🚀 ~ error:", error);
    }
  };
};

const generateJwtToken = (payload) => {
  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const generateRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = {
  CustomError,
  asyncHandler,
  generateJwtToken,
  generateRandomColor
};
