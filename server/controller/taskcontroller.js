const dbConnection = require("../database/dbconfig");
const getTasks=async(req,res)=>{
        try{
            const userid=req.user.id;
            const [tasks]=await dbConnection.query("select * from tasks where userid=?",[userid]);
            res.status(200).json(tasks)
        }catch{
            res.status(500).json({message:"failed to fetch tasks"})

        }
}

const createtask=async(req,res)=>{
        
}