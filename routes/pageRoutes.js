const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});
router.get("/employee-pos", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/employee-pos.html"));
});
router.get("/employee-transactons", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/employee-transactions.html"));
});
router.get("/employee-reports", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/employee-reports.html"));
});
router.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin-dashboard.html"));
});
router.get("/admin-employees", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin-employees.html"));
});
router.get("/admin-transactions", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin-transactions.html"));
});
router.get("/admin-products", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/admin-products.html"));
});
module.exports = router;
