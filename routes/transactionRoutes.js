const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const transactionController = require("../controllers/transactionController");

router.post("/", verifyToken, transactionController.createTransaction);

module.exports = router;
