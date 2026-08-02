document.addEventListener("DOMContentLoaded", () => {
  checkAuth();

  const user = getCurrentUser();

  logout();

  loadEmployees();
  searchEmployees();
  addEmployee();
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
      updateEmployee();
      employeeStatusUpdate();
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

    let statusButtonText = "";
    if (employee.status === "active") {
      statusButtonText = "Deactivate";
    } else {
      statusButtonText = "Activate";
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
        <td>  
        <button
        class="btn btn-secondary edit-employee-button"
        type="button"
        data-employee-id="${employee.id}"
         >
        Edit
    </button>
    <button class= "btn btn-secondary status-employee-button" type="button" data-employee-id="${employee.id}" data-status="${employee.status}">${statusButtonText}</button></td>
   
    `;

    tableBody.appendChild(row);
  }
}

function searchEmployees() {
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

function addEmployee() {
  const addEmployeeBtn = document.getElementById("addEmployeeButton");
  const addEmployeeModal = document.getElementById("addEmployeeModal");
  const addEmployeeForm = document.getElementById("addEmployeeForm");
  const saveEmployeeButton = document.getElementById("saveEmployeeButton");
  const cancelAddEmployeeBtn = document.getElementById(
    "cancelAddEmployeeButton",
  );
  const closeEmployeeModal = document.getElementById(
    "closeAddEmployeeModalButton",
  );

  if (addEmployeeBtn && addEmployeeModal) {
    addEmployeeBtn.addEventListener("click", () => {
      addEmployeeModal.hidden = false;
    });
  }

  const closeModalReset = () => {
    if (addEmployeeModal) {
      addEmployeeModal.hidden = true;
    }
    if (addEmployeeForm) {
      addEmployeeForm.reset();
    }
  };

  if (closeEmployeeModal && addEmployeeModal) {
    closeEmployeeModal.addEventListener("click", closeModalReset);
  }

  if (cancelAddEmployeeBtn && addEmployeeModal) {
    cancelAddEmployeeBtn.addEventListener("click", closeModalReset);
  }

  if (addEmployeeForm) {
    addEmployeeForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");

      const formData = Object.fromEntries(new FormData(e.target));

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      saveEmployeeButton.disabled = true;

      try {
        const response = await fetch("/employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const results = await response.json();

        if (response.ok) {
          alert("Employee successfully added!");
          closeModalReset();
          await loadEmployees();
        } else {
          alert(results.message || "Failed to add employee.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        alert("May problema sa koneksyon o sa server.");
      } finally {
        saveEmployeeButton.disabled = false;
      }
    });
  }
}

function updateEmployee() {
  const editForm = document.getElementById("editEmployeeForm");
  const editButtons = document.querySelectorAll(".edit-employee-button");
  const closeModalButton = document.getElementById(
    "closeEditEmployeeModalButton",
  );
  const cancelButton = document.getElementById("cancelEditEmployeeButton");
  const saveButton = document.getElementById("saveEditEmployeeButton");
  const editModal = document.getElementById("editEmployeeModal");

  let eId = 0;

  const closeModalReset = () => {
    editForm.reset();
    editModal.hidden = true;
    eId = 0;
  };

  if (closeModalButton) {
    closeModalButton.addEventListener("click", closeModalReset);
  }

  if (cancelButton) {
    cancelButton.addEventListener("click", closeModalReset);
  }

  editButtons.forEach((editButton) => {
    editButton.addEventListener("click", async () => {
      eId = editButton.dataset.employeeId;
      editModal.hidden = false;
    });
  });

  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(e.target));
      const token = localStorage.getItem("token");

      saveButton.disabled = true;
      try {
        const response = await fetch(`/employee/${eId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        const results = await response.json();
        if (response.ok) {
          closeModalReset();
          await loadEmployees();
        } else {
          alert(results.message || "Failed to update employee.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        saveButton.disabled = false;
      }
    });
  }
}

function employeeStatusUpdate() {
  const statusButton = document.querySelectorAll(".status-employee-button");
  const employeeModal = document.getElementById("employeeConfirmationModal");
  const confirmButton = document.getElementById("confirmEmployeeStatusButton");
  const cancelButton = document.getElementById("cancelEmployeeStatusButton");

  let eId = 0;
  let status = "";
  let newStatus = "";

  if (cancelButton) {
    cancelButton.addEventListener("click", () => {
      employeeModal.hidden = true;
      eId = 0;
      status = "";
      newStatus = "";
    });
  }

  statusButton.forEach((button) => {
    button.addEventListener("click", () => {
      eId = button.dataset.employeeId;
      status = button.dataset.status;

      if (status === "active") {
        newStatus = "inactive";
      } else {
        newStatus = "active";
      }

      employeeModal.hidden = false;
    });
  });

  if (confirmButton) {
    confirmButton.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`/employee/${eId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        });

        const results = await response.json();
        if (response.ok) {
          eId = 0;
          status = "";
          newStatus = "";
          employeeModal.hidden = true;
          await loadEmployees();
        }
      } catch (err) {
        console.error("Errro while updating status", err);
      }
    });
  }
}
