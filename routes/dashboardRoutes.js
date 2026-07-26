const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeAdmin } = require("../middlewares/authorizeAdmin");
const dashboardController = require("../controllers/dashboardController");

router.get(
  "/",
  verifyToken,
  authorizeAdmin,
  dashboardController.getDashboardSummary,
);

module.exports = router;
