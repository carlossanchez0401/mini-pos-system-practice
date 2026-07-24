const db = require("../config/db");

async function getProductById(productId) {
  const [results] = await db.query(
    "SELECT id, product_name, price, stock_quantity, status FROM products WHERE id=?",
    [productId],
  );

  return results[0];
}

async function createTransactionRecord(
  connection,
  transactionCode,
  employeeId,
  totalItems,
  totalAmount,
  paymentAmount,
  changeAmount,
) {
  const [results] = await connection.query(
    'INSERT INTO transactions (transaction_code, employee_id, total_items, total_amount, payment_amount, change_amount, status) VALUES (?,?,?,?,?,?,"completed") ',
    [
      transactionCode,
      employeeId,
      totalItems,
      totalAmount,
      paymentAmount,
      changeAmount,
    ],
  );

  return results.insertId;
}

async function createTransactionItem(
  connection,
  transactionId,
  productId,
  productName,
  quantity,
  unitPrice,
  subtotal,
) {
  const [results] = await connection.query(
    "INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price, subtotal) VALUES (?,?,?,?,?,?)",
    [transactionId, productId, productName, quantity, unitPrice, subtotal],
  );

  return results;
}

async function deductProductStock(connection, productId, quantity) {
  const [results] = await connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ?  WHERE id=? AND stock_quantity >= ?",
    [quantity, productId, quantity],
  );

  return results;
}

module.exports = {
  getProductById,
  createTransactionRecord,
  createTransactionItem,
  deductProductStock,
};
