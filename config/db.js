const mysql2 = require("mysql2");
const db = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("DATABASE ERROR", err.message);
  } else {
    connection.release();
    console.log("DATABASE IS RUNNING");
  }
});

module.exports = db.promise();
