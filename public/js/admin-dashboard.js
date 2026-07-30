document.addEventListener("DOMContentLoaded", () => {
  checkAuth();

  const user = getCurrentUser();

  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  loadDashboard();
});

async function loadDashboard() {
  const dashboardLoading = document.getElementById("dashboardLoading");
  const dashboardError = document.getElementById("dashboardError");

  if (dashboardLoading) {
    dashboardLoading.hidden = false;
  }

  if (dashboardError) {
    dashboardError.hidden = true;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      renderSummaryCards(data.data);
      renderRecentTransactions(data.data.recentTransaction);
    } else {
      dashboardError.hidden = false;
    }
  } catch (err) {
    console.error("Dashboard Load Error:", err);
    dashboardError.hidden = false;
  } finally {
    dashboardLoading.hidden = true;
  }
}

function renderSummaryCards(data) {
  document.getElementById("dashboardTotalEmployees").textContent =
    data.employeesCount.total_employee;

  document.getElementById("dashboardTotalSales").textContent = Number(
    data.salesSummary.total_sales,
  ).toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  const completed = Number(data.salesSummary.completed_transactions) || 0;
  const voided = Number(data.salesSummary.voided_transactions) || 0;
  document.getElementById("dashboardTotalTransactions").textContent =
    completed + voided;

  document.getElementById("dashboardProductsSold").textContent =
    data.salesSummary.total_items_sold;
}

function renderRecentTransactions(recentTransactions) {
  const tableBody = document.getElementById(
    "dashboardRecentTransactionsTableBody",
  );

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (
    !recentTransactions ||
    !Array.isArray(recentTransactions) ||
    recentTransactions.length === 0
  ) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No recent transaction found.</td></tr>`;
    return;
  }

  for (const transaction of recentTransactions) {
    const row = document.createElement("tr");

    const formattedDate = new Date(transaction.created_at).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );

    const formattedAmount = Number(transaction.total_amount).toLocaleString(
      "en-PH",
      {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    );

    let statusClass = "";

    if (transaction.status === "completed") {
      statusClass = "status-completed";
    } else if (transaction.status === "voided") {
      statusClass = "status-voided";
    }

    row.innerHTML = `
    <td>${transaction.transaction_code}</td>
    <td>${transaction.full_name}</td>
    <td>${formattedDate}</td>
    <td>${transaction.total_items}</td>
    <td>${formattedAmount}</td>
    <td>
      <span class="status-badge ${statusClass}">
       ${transaction.status}
      </span>
    </td>`;

    tableBody.appendChild(row);
  }
}
