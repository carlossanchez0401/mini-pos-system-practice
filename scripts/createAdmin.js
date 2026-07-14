require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db");

async function createAdmin(fullName, email, username, password, role, status) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [admin] = await db.query(
      "INSERT INTO users (full_name, email, username, password, role , status) VALUES (?, ?, ?, ?, ? ,? )",
      [fullName, email, username, hashedPassword, role, status],
    );
    console.log("Admin created successfully");
    console.log("Admin ID:", admin.insertId);
  } catch (err) {
    console.error(err.message);
  } finally {
    await db.end();
  }
}

createAdmin(
  "Bong good",
  "admin6@gmail.com",
  "admin",
  "123456",
  "employee",
  "active",
);
