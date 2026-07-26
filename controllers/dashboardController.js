const dashboardModel = require("../models/dashboardModel");

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

async function getSalesReport(req, res) {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date are required",
      });
    }
    const parsedStartDate = new Date(startDate);
    const nextEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime()) ||
      Number.isNaN(nextEndDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (parsedStartDate > nextEndDate) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be later than end date",
      });
    }

    nextEndDate.setDate(nextEndDate.getDate() + 1);

    const formattedNextEndDate = nextEndDate.toISOString().split("T")[0];

    const [summary, transactions, topSellingProducts] = await Promise.all([
      dashboardModel.getSalesReportSummary(startDate, formattedNextEndDate),
      dashboardModel.getSalesTransactions(startDate, formattedNextEndDate),
      dashboardModel.getTopSellingProducts(startDate, formattedNextEndDate),
    ]);

    return res.status(200).json({
      success: true,
      message: "Sales report retrieved successfully",
      data: {
        dateRange: {
          startDate,
          endDate,
        },
        summary,
        transactions,
        topSellingProducts,
      },
    });
  } catch (err) {
    console.error("Error while retrieving sales report:", err);

    return res.status(500).json({
      success: false,
      message: "Error while retrieving sales report",
    });
  }
}

async function getInventoryReport(req, res) {
  try {
    const { status } = req.query;

    const validStatuses = [
      "available",
      "low-stock",
      "out-of-stock",
      "inactive",
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use available, low-stock, or out-of-stock",
      });
    }

    const products = await dashboardModel.getInventoryReport(status);

    return res.status(200).json({
      success: true,
      message: "Inventory report retrieved successfully",
      data: {
        filter: {
          status: status || "all",
        },
        totalProducts: products.length,
        products,
      },
    });
  } catch (err) {
    console.error("Error while retrieving inventory report:", err);

    return res.status(500).json({
      success: false,
      message: "Error while retrieving inventory report",
    });
  }
}

module.exports = {
  getDashboardSummary,
  getSalesReport,
  getInventoryReport,
};
