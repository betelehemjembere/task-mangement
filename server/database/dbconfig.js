const mysql2 = require('mysql2/promise'); // Use promise-based version

// Database connection
const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database:process.env.DATABASE , 
  host: "localhost",
  password: process.env.PASSWORD,  
  connectionLimit: 10
});
console.log(process.env.JWT_SECRET)




// Test the connection
// async function testConnection() {
//   try {
//     const [result] = await dbConnection.query("SELECT 'test'");
//     console.log(result);
//   } catch (err) {
//     console.log(err.message);
//   }
// }

// testConnection();

module.exports = dbConnection; // Ensure you export the connection pool
