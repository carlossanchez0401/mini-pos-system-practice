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

  if (isNaN(price) || isNaN(stockQuantity)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Input",
    });
  }

  if (price < 0 || stockQuantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Price and stock quantity cannot be negative",
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

async function updateProduct(req, res) {
  const id = Number(req.params.id);
  const { productName, category, price, stockQuantity, status } = req.body;

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

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

  if (isNaN(price) || isNaN(stockQuantity)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Input",
    });
  }

  if (price < 0 || stockQuantity < 0) {
    return res.status(400).json({
      success: false,
      message: "Price and stock quantity cannot be negative",
    });
  }
  try {
    const product = await productModel.updateProduct(
      productName,
      category,
      price,
      stockQuantity,
      status,
      id,
    );
    if (product.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Product Updated",
      results: {
        productId: id,
      },
    });
  } catch (err) {
    console.error("Product Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error while updating a product",
    });
  }
}

async function deleteProduct(req, res) {
  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid Product ID",
    });
  }
  try {
    const product = await productModel.deleteProduct(productId);

    if (product.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not founds",
      });
    }
    return res.status(200).json({
      success: false,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Product Controller Error", err);
    return res.status(500).json({
      success: false,
      message: "Error while deleting product",
    });
  }
}

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
};
