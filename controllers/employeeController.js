const employeeModel = require("../models/employeeModel");

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

module.exports = {
  getEmployees,
};
