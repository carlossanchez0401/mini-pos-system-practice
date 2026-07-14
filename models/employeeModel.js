const db = require("../config/db");

async function getEmployees() {
  const [results] = await db.query(
    "SELECT id , full_name, email, username, role, status, created_at FROM users WHERE role = 'employee' ORDER BY full_name ",
  );

  return results;
}

async function getEmployeeByEmailOrUsername(email, username) {
  const [results] = await db.query(
    "SELECT * FROM users WHERE email=? OR username=?",
    [email, username],
  );

  return results[0];
}

async function addEmployee(fullName, email, username, password, status) {
  const [results] = await db.query(
    `INSERT INTO users (full_name, email, username, password, role, status) VALUES (?, ?, ?, ?, 'employee', ?)`,
    [fullName, email, username, password, status],
  );

  return results;
}

module.exports = {
  getEmployees,
  getEmployeeByEmailOrUsername,
  addEmployee,
};
