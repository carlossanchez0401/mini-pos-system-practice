const db = require("../config/db");

async function searchEmployees(search) {
  const [results] = await db.query(
    `SELECT id, full_name, email, username, role, status, created_at FROM users WHERE role = 'employee' AND (full_name LIKE ? OR email LIKE ? OR username LIKE ?) ORDER BY full_name ASC`,
    [`%${search}%`, `%${search}%`, `%${search}%`],
  );

  return results;
}

async function getEmployees() {
  const [results] = await db.query(
    "SELECT id , full_name, email, username, role, status, created_at FROM users WHERE role = 'employee' ORDER BY full_name ",
  );

  return results;
}

async function getEmployeeById(id) {
  const [results] = await db.query(
    "SELECT full_name, email, username, status FROM users WHERE id=? AND role='employee'",
    [id],
  );
  return results[0];
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

async function updateEmployee(fullName, email, username, status, id) {
  const [results] = await db.query(
    'UPDATE users SET full_name=?, email=?, username=?, status=? WHERE id=? AND role="employee" ',
    [fullName, email, username, status, id],
  );

  return results;
}

async function employeeStatusUpdate(status, id) {
  const [results] = await db.query(
    'UPDATE users SET status=? WHERE id=? AND role="employee"',
    [status, id],
  );

  return results;
}
module.exports = {
  getEmployees,
  getEmployeeById,
  getEmployeeByEmailOrUsername,
  addEmployee,
  updateEmployee,
  searchEmployees,
  employeeStatusUpdate,
};
