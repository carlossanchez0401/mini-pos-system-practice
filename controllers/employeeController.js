const employeeModel = require("../models/employeeModel");
const bcrypt = require("bcrypt");

async function getEmployees(req, res) {
  try {
    const results = await employeeModel.getEmployees();
    return res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      data: results,
    });
  } catch (err) {
    console.error("Employee Model Error", err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving employees",
    });
  }
}

async function addEmployee(req, res) {
  const { fullName, email, username, password, confirmPassword, status } =
    req.body;
  const statuses = ["active", "inactive"];

  if (
    !fullName ||
    !email ||
    !username ||
    !password ||
    !confirmPassword ||
    !status
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  if (!statuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be active or inactive",
    });
  }
  try {
    const existingEmployee = await employeeModel.getEmployeeByEmailOrUsername(
      email,
      username,
    );

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Email or username already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = await employeeModel.addEmployee(
      fullName,
      email,
      username,
      hashedPassword,
      status,
    );

    return res.status(201).json({
      success: true,
      message: "Employee account created successfully",
      data: {
        employeeId: newEmployee.insertId,
      },
    });
  } catch (err) {
    console.error("Error in employeeController", err);
    return res.status(500).json({
      success: false,
      message: "Error while adding new employee",
    });
  }
}

module.exports = {
  getEmployees,
  addEmployee,
};
