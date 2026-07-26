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

router.get(
  "/sales-report",
  verifyToken,
  authorizeAdmin,
  dashboardController.getSalesReport,
);

router.get(
  "/inventory",
  verifyToken,
  authorizeAdmin,
  dashboardController.getInventoryReport,
);

module.exports = router;
