const { startSucceeded } = require("init");
const transactionModel = require("../models/transactionModel");

async function createTransaction(req, res) {
  const employeeId = req.user.id;
  const { items, paymentAmount } = req.body;

  if (!items || paymentAmount === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
}
