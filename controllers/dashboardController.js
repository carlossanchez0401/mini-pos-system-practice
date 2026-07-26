const dashboardModel = require("../models/dashboarModel");

async function getDashboardSummary(req, res) {
  try {
    const [salesSummary, employeesCount, productSummary, recentTransactions] =
      await Promise.all([
        dashboardModel.getSalesSummary(),
        dashboardModel.getEmployeesCount(),
        dashboardModel.getProductSummary(),
        dashboardModel.getRecentTransactions(),
      ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved successfully",
      data: {
        salesSummary,
        employeesCount,
        productSummary,
        recentTransactions,
      },
    });
  } catch (err) {
    console.error("Error while retrieving dashboard summary:", err);

    return res.status(500).json({
      success: false,
      message: "Error while retrieving dashboard summary",
    });
  }
}

module.exports = {
  getDashboardSummary,
};
