require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Mini POS API is running");
});

app.listen(3000, () => {
  console.log("Server is running");
});
