const productModel = require("../models/productModel");

async function getProducts(req, res) {
  try {
    const results = await productModel.getProducts();

    return res.status(200).json({
      success: true,
      message: "Products Retrieved",
      data: results,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function addProduct(req, res) {
  const { productName, category, price, stockQuantity, status } = req.body;

  if (
    !productName ||
    !category ||
    price === undefined ||
    stockQuantity === undefined ||
    !status
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (price < 0 || stockQuantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Price and stock quantity cannot be negative",
    });
  }

  if (isNaN(price) || isNaN(stockQuantity)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Input",
    });
  }

  try {
    const product = await productModel.addProduct(
      productName,
      category,
      price,
      stockQuantity,
      status,
    );

    return res.status(201).json({
      success: true,
      message: "Product Added",
      data: {
        productId: product.insertId,
      },
    });
  } catch (err) {
    console.error("Product Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getProducts,
  addProduct,
};
