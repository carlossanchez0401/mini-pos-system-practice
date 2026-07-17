const employeeController = require("../controllers/employeeController");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeAdmin } = require("../middlewares/authorizeAdmin");

router.get("/", verifyToken, authorizeAdmin, employeeController.getEmployees);
router.post("/", verifyToken, authorizeAdmin, employeeController.addEmployee);
router.put(
  "/:id",
  verifyToken,
  authorizeAdmin,
  employeeController.updateEmployee,
);

module.exports = router;
