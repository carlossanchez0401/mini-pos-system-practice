const db = require("../config/db");

async function getUserByIdentifier(identifier) {
  const [results] = await db.query(
    "SELECT * FROM users WHERE email=? OR username=?",
    [identifier, identifier],
  );

  return results[0];
}

module.exports = {
  getUserByIdentifier,
};
