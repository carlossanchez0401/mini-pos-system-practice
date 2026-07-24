const db = require("../config/db");
const transactionModel = require("../models/transactionModel");

async function createTransaction(req, res) {
  let connection;

  const employeeId = req.user.id;
  const { items, paymentAmount } = req.body;

  if (!items || paymentAmount === undefined) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one item is required",
    });
  }

  const payment = Number(paymentAmount);

  if (isNaN(payment) || payment <= 0) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid payment amount",
    });
  }

  const hasInvalidItems = items.some((item) => {
    if (!item) {
      return true;
    }

    const productId = Number(item.productId);
    const quantity = Number(item.quantity);

    return (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    );
  });

  if (hasInvalidItems) {
    return res.status(400).json({
      success: false,
      message: "Each item must have a valid product ID and quantity",
    });
  }

  try {
    const transactionItems = [];
    let totalItems = 0;
    let totalAmount = 0;

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      const product = await transactionModel.getProductById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.status !== "available" && product.status !== "low-stock") {
        return res.status(400).json({
          success: false,
          message: `${product.product_name} is not available`,
        });
      }

      if (product.stock_quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.product_name}`,
        });
      }

      const unitPrice = Number(product.price);
      const subtotal = unitPrice * quantity;

      totalItems += quantity;
      totalAmount += subtotal;

      transactionItems.push({
        productId,
        productName: product.product_name,
        quantity,
        unitPrice,
        subtotal,
      });
    }

    if (payment < totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Payment",
      });
    }

    const changeAmount = payment - totalAmount;

    const transactionCode = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    connection = await db.getConnection();
    await connection.beginTransaction();

    const transactionId = await transactionModel.createTransactionRecord(
      connection,
      transactionCode,
      employeeId,
      totalItems,
      totalAmount,
      payment,
      changeAmount,
    );

    for (const item of transactionItems) {
      await transactionModel.createTransactionItem(
        connection,
        transactionId,
        item.productId,
        item.productName,
        item.quantity,
        item.unitPrice,
        item.subtotal,
      );

      const stockResult = await transactionModel.deductProductStock(
        connection,
        item.productId,
        item.quantity,
      );

      if (stockResult.affectedRows === 0) {
        throw new Error(`Unable to deduct stock for ${item.productName}`);
      }
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: {
        transactionId,
        transactionCode,
        employeeId,
        totalItems,
        totalAmount,
        paymentAmount: payment,
        changeAmount,
        items: transactionItems,
      },
    });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Error while creating transaction",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function getAllTransactions(req, res) {
  try {
    const transactions = await transactionModel.getAllTransactions();

    return res.status(200).json({
      success: true,
      message: "Transactions list retrieved successfully",
      data: transactions,
    });
  } catch (err) {
    console.error("Error While retrieving transactions", err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving transactions",
    });
  }
}

async function getTransactionById(req, res) {
  const transactionId = Number(req.params.id);

  if (!Number.isInteger(transactionId) || transactionId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid Transaction ID",
    });
  }

  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const transaction =
      await transactionModel.getTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (userRole !== "admin" && userId !== transaction.employee_id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this transaction",
      });
    }

    const transactionItems =
      await transactionModel.getTransactionItemsByTransactionId(transactionId);

    if (transactionItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction items not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: {
        ...transaction,
        items: transactionItems,
      },
    });
  } catch (err) {
    console.error("Error while getting transaction by ID ", err);
    return res.status(500).json({
      success: false,
      message: "Error while getting transaction by ID ",
    });
  }
}

async function getTransactionByEmployeeId(req, res) {
  const employeeId = Number(req.user.id);

  if (!Number.isInteger(employeeId) || employeeId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid employee ID",
    });
  }

  try {
    const transactions =
      await transactionModel.getTransactionByEmployeeId(employeeId);

    return res.status(200).json({
      success: true,
      message: "Employee transactions retrieved successfully",
      data: transactions,
    });
  } catch (err) {
    console.error("Error while retrieving employee transactions:", err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving employee transactions",
    });
  }
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionByEmployeeId,
  getTransactionById,
};
