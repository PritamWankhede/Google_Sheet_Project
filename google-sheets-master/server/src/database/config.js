const mongoose = require("mongoose");
require("dotenv").config(); 
const connect = async () => {
  try {
    mongoose.set("strictQuery", true);

    let uri = process.env.NODE_ENV === "development"
      ? process.env.MONGO_URI_DEV
      : process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    let res = await mongoose.connect(uri);

    console.log(
      "🚀 ~ MongoDB connected to ~",
      res.connection.host
    );
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1); 
  }
};

module.exports = connect;
