const db = require("../config/db");

async function getProducts() {
  const [results] = await db.query(
    "SELECT * FROM products ORDER BY product_name",
  );

  return results;
}

async function addProduct(productName, category, price, stockQuantity, status) {
  const [results] = await db.query(
    "INSERT INTO products (product_name, category, price, stock_quantity, status) VALUES (?, ? , ? , ?, ?)",
    [productName, category, price, stockQuantity, status],
  );

  return results;
}

module.exports = {
  getProducts,
  addProduct,
};
