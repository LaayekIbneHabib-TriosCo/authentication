require("dotenv").config();
const mongoose = require("mongoose");
const uri = process.env.URI;

const initiateMongoDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
    });
    console.log("Connected to the database");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = initiateMongoDB;
