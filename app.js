require("dotenv").config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const app = express();
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const pageRoutes = require("./routes/pageRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", pageRoutes);

app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/employee", employeeRoutes);
app.use("/transactions", transactionRoutes);

app.listen(PORT, () => {
  console.log("Server is running");
});
