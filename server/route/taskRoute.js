const express = require("express");
const router = express.Router();

const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}=require('../controller/taskcontroller');


router.get('/', getTasks); // List all tasks for logged-in user
router.post('/', createTask); // Create a new task
router.put('/:id', updateTask); // Update a task
router.delete('/:id', deleteTask); // Delete a task


module.exports=router;
