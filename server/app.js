require("dotenv").config(); // Load environment variables
const express = require("express");
const dbConnection = require("./database/dbconfig"); // DB connection
const taskRouter= require("./route/taskRoute")
const app = express();
const port = 5500;


app.use(express.json());
app.use("/api/task",taskRouter);




//starting  function for the backend 
async function start() {
  try {
    // Test the database connection
    const [result] = await dbConnection.execute("SELECT 'test' AS message");
    console.log(result[0]); // Logs the test query result

    // Start the server
    app.listen(port, () => {
      console.log("Database connection established");
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the application:", error.message);
  }
}

start();
