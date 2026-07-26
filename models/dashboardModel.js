const db = require("../config/db");

async function getSalesSummary() {
  const [results] = await db.query(
    `SELECT COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END ), 0) AS total_sales, COALESCE(SUM(CASE WHEN status ='completed' THEN 1 ELSE 0 END ), 0) AS completed_transactions, COALESCE(SUM(CASE WHEN status = 'voided' THEN 1 ELSE 0 END ), 0 ) AS voided_transactions FROM transactions `,
  );

  return results[0];
}

async function getEmployeesCount() {
  const [results] = await db.query(
    `SELECT COALESCE(SUM(CASE WHEN role = 'employee' THEN 1 ELSE 0 END), 0) AS total_employee, COALESCE(SUM(CASE WHEN role = 'employee' AND status = 'active' THEN 1 ELSE 0 END), 0) AS active_employees FROM users`,
  );

  return results[0];
}

async function getProductSummary() {
  const [results] = await db.query(
    `SELECT COUNT(*) AS total_products, COALESCE(SUM(CASE WHEN status = 'low-stock' THEN 1 ELSE 0 END), 0 ) AS low_stock_products, COALESCE(SUM(CASE WHEN status = 'out-of-stock' THEN 1 ELSE 0 END), 0) AS out_of_stock_products, COALESCE(SUM(CASE WHEN status='available' THEN 1 ELSE 0 END), 0) AS available_products FROM products`,
  );

  return results[0];
}

async function getRecentTransactions() {
  const [results] = await db.query(
    `SELECT t.id, t.transaction_code, users.full_name, t.total_items, t.total_amount, t.status, t.created_at FROM transactions AS t JOIN users ON t.employee_id = users.id ORDER BY t.created_at DESC LIMIT 5 `,
  );

  return results;
}

async function getSalesReportSummary(startDate, nextEndDate) {
  const [results] = await db.query(
    `
    SELECT COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END ), 0) AS total_sales, COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) AS completed_transactions, COALESCE(SUM(CASE WHEN status='voided' THEN 1 ELSE 0 END), 0) AS voided_transactions, COALESCE(SUM(CASE WHEN status ='completed' THEN total_items ELSE 0 END), 0) AS total_items_sold FROM transactions  WHERE created_at >= ? AND created_at < ?`,
    [startDate, nextEndDate],
  );

  return results[0];
}

async function getSalesTransactions(startDate, nextEndDate) {
  const [results] = await db.query(
    `SELECT
      t.id,
      t.transaction_code,
      t.employee_id,
      u.full_name,
      t.total_items,
      t.total_amount,
      t.payment_amount,
      t.change_amount,
      t.status,
      t.created_at
     FROM transactions AS t
     JOIN users AS u
       ON t.employee_id = u.id
     WHERE t.created_at >= ?
       AND t.created_at < ?
     ORDER BY t.created_at DESC`,
    [startDate, nextEndDate],
  );

  return results;
}

module.exports = {
  getSalesSummary,
  getEmployeesCount,
  getProductSummary,
  getRecentTransactions,
  getSalesReportSummary,
  getSalesTransactions,
};
