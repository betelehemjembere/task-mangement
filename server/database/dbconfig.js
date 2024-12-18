const mysql2 = require("mysql2/promise"); // Promise-based MySQL

// Database connection
const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database: process.env.DATABASE,
  host: "localhost", // Change to 127.0.0.1 if localhost doesn't work
  password: process.env.PASSWORD,
  connectionLimit: 10, // Max number of connections in the pool
});

// Export the connection pool
module.exports = dbConnection;
