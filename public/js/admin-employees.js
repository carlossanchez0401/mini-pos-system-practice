document.addEventListener("DOMContentLoaded", () => {
  checkAuth();

  const user = getCurrentUser();

  logout();

  loadEmployees();
  searchEmployees();
});

async function loadEmployees() {
  const employeeLoading = document.getElementById("employeeLoadingMessage");
  const employeeError = document.getElementById("employeeErrorMessage");

  if (employeeLoading) {
    employeeLoading.hidden = false;
  }

  if (employeeError) {
    employeeError.hidden = true;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/employee", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const results = await response.json();
    if (response.ok) {
      renderEmployees(results.data);
    }
  } catch (err) {
    employeeError.hidden = false;
    console.error("Loading employee error", err);
  } finally {
    employeeLoading.hidden = true;
  }
}

function renderEmployees(employees) {
  const tableBody = document.getElementById("employeeTableBody");
  const emptyState = document.getElementById("employeeEmptyState");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (employees.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  for (const employee of employees) {
    const row = document.createElement("tr");

    const employeeCode = `EMP-${String(employee.id).padStart(3, "0")}`;

    const formattedDate = new Date(employee.created_at).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );

    let statusClass = "";

    if (employee.status === "active") {
      statusClass = "status-active";
    } else if (employee.status === "inactive") {
      statusClass = "status-inactive";
    }

    row.innerHTML = `
        <td>${employeeCode}</td>
        <td>${employee.full_name}</td>
        <td>${employee.email}</td>
        <td>${employee.username}</td>
        <td>${employee.role}</td>
        <td>
          <span class="status-badge ${statusClass}">${employee.status}</span>
        </td>
        <td>${formattedDate}</td>
        <td></td>
    `;

    tableBody.appendChild(row);
  }
}

async function searchEmployees() {
  const employeeFilterForm = document.getElementById("employeeFilterForm");
  const employeeSearchInput = document.getElementById("employeeSearchInput");

  employeeFilterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const keyword = employeeSearchInput.value.trim();

    if (!keyword) {
      loadEmployees();
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `/employee/search?search=${encodeURIComponent(keyword)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const results = await response.json();

      if (response.ok) {
        renderEmployees(results.data);
      } else {
        console.error(results.message);
      }
    } catch (err) {
      console.error("Loading employee error", err);
    }
  });
}
