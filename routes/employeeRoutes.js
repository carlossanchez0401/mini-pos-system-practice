const employeeController = require("../controllers/employeeController");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeAdmin } = require("../middlewares/authorizeAdmin");

router.get("/", verifyToken, authorizeAdmin, employeeController.getEmployees);
router.get(
  "/search",
  verifyToken,
  authorizeAdmin,
  employeeController.searchEmployees,
);
router.post("/", verifyToken, authorizeAdmin, employeeController.addEmployee);
router.put(
  "/:id",
  verifyToken,
  authorizeAdmin,
  employeeController.updateEmployee,
);
router.patch(
  "/:id/status",
  verifyToken,
  authorizeAdmin,
  employeeController.employeeStatusUpdate,
);

module.exports = router;
