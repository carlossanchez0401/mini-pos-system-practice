document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginLoading = document.getElementById("loginLoading");
  const loginMessage = document.getElementById("loginMessage");
  const loginSuccess = document.getElementById("loginSuccess");
  const loginButton = document.getElementById("loginButton");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginLoading.hidden = false;
    loginMessage.hidden = true;
    loginSuccess.hidden = true;
    loginButton.disabled = true;

    const identifier = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.data.id,
            name: data.data.name,
            role: data.data.role,
          }),
        );

        loginLoading.hidden = true;
        loginSuccess.hidden = false;

        if (data.data.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/employee-transactions";
        }
      } else {
        loginLoading.hidden = true;
        loginMessage.hidden = false;
        loginMessage.textContent = data.message || "Login failed.";
        loginButton.disabled = false;
      }
    } catch (err) {
      loginLoading.hidden = true;
      loginMessage.hidden = false;
      loginMessage.textContent = "Something went wrong while logging in.";
      loginButton.disabled = false;
      console.error(err);
    }
  });
});
