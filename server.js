const express=require('express');
const {MongoClient,ObjectId}=require("mongodb");

const app=express();
const todoRoutes=express.Router();
app.use(express.json());
app.use('/todo',todoRoutes);
const uri="mongodb://localhost:27017"
const client=new MongoClient(uri);
let db;
// routes
todoRoutes.route("/add").post(async (req,res)=>{
   await db.collection("todos").insertOne(req.body)
    res.send(req.body);
    })
    todoRoutes.route("/").get(async(req,res)=>{
        const data=await db.collection("todos").find({}).toArray();
        res.send(data)
    })

todoRoutes.route("/:id").get(async(req,res)=>{
    let id=new ObjectId(req.params.id)
    const data=await db.collection("todos").find({_id:id}).toArray();
    res.send(data)
})
todoRoutes.route("/update/:id").put(async(req,res)=>{
    let id=new ObjectId(req.params.id);
    let todo=await db.collection("todos").findOneAndUpdate({_id:id},{
        $set:{
            text: req.body.text,
            created_at:req.body.created_at,
            // Tags: [...Tags,req.body.Tags],
            is_complete: req.body.is_complete
        }},{
            returnDocument:'after'
        }
    )
    console.log(todo)
    res.send(todo)
})
async function connectToMongoAndStartServer(){
await client.connect();
db=client.db("todoApp");
console.log("mongodb Connected")
app.listen(3000,()=>{
    console.log("server is running on 3000");
})
}

connectToMongoAndStartServer().then(console.log).catch((err)=>{
    console.log("err",err)
})


