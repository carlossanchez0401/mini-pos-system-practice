const db = require("../config/db");

async function getEmployees() {
  const [results] = await db.query(
    "SELECT id , full_name, email, username, role, status, created_at FROM users WHERE role = 'employee' ORDER BY full_name ",
  );

  return results;
}

module.exports = {
  getEmployees,
};
