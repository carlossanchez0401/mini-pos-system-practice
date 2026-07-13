const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeAdmin } = require("../middlewares/authorizeAdmin");

router.get("/", verifyToken, productController.getProducts);
router.post("/", verifyToken, authorizeAdmin, productController.addProduct);

module.exports = router;
