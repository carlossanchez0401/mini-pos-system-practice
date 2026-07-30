function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("/");
  }
}

function redirectIfLoggedIn() {
  const token = localStorage.getItem("token");

  if (!token) {
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (user.role === "admin") {
    window.location.href = "/admin-dashboard.html";
  } else {
    window.location.href = "/employee-dashboard.html";
  }
}

function getCurrentUser() {
  const userInfo = localStorage.getItem("user");

  if (userInfo) {
    const user = JSON.parse(userInfo);

    const adminName = document.getElementById("adminName");
    const adminRole = document.getElementById("adminRole");
    const headerAdminName = document.getElementById("headerAdminName");

    if (adminName) {
      adminName.textContent = user.name;
    }
    if (adminRole) {
      adminRole.textContent = user.role;
    }

    if (headerAdminName) {
      headerAdminName.textContent = user.name;
    }

    return user;
  } else {
    return null;
  }
}

function logout() {
  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/");
    });
  }
}
