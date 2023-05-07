const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const initiateMongoDB = require("./config/db_connection");
const user = require("./routes/user");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
initiateMongoDB();

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.use("/user", user);

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Listening on port number ${PORT}`);
});
