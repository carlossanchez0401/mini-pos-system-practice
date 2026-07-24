const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeAdmin } = require("../middlewares/authorizeAdmin");
const transactionController = require("../controllers/transactionController");

router.post("/", verifyToken, transactionController.createTransaction);
router.get(
  "/",
  verifyToken,
  authorizeAdmin,
  transactionController.getAllTransactions,
);
router.get(
  "/my",
  verifyToken,
  transactionController.getTransactionByEmployeeId,
);

module.exports = router;
