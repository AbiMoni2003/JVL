require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
app.use(express.json())
app.use(cors());
const DATABASE_URL = process.env.DATABASE_URL

//let todos=[];
mongoose.connect(DATABASE_URL)
.then(()=>{
    console.log('DB connected...');
    
})
.catch((err)=>{
    console.log(err);
    
})
//Creating Schema
const todoSchema= mongoose.Schema({
    title:{
        required:true,
        type:String
       },
    description:{
        required:true,
        type:String}
})

//Creating Model
const todoModel=mongoose.model('Todo',todoSchema)
// create the items
app.post('/todos',async(req,res)=>{
    const {title,description}=req.body;
   
    // const newTodo={
    //     id:todos.length+1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);

    try {
        const newTodo=new todoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error);
        res.status(400).json({message:error.message});
    }  
})

//get all items
app.get('/todos',async(req,res)=>{
    try {
        const todos = await todoModel.find();
        res.json(todos)
    } catch (error) {
      res.status(400).json({message:error.message})  
    }
})

//get by Id
app.get('/todos/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        const todos = await todoModel.findById(id);
       res.json(todos)
    } catch (error) {
      res.status(400).json({message:error.message})  
    }
})

//update the todo list
app.put('/todos/:id',async(req,res)=>{
    try {
        const {title,description}=req.body;
        const id=req.params.id;
        const updatedTodo=await todoModel.findByIdAndUpdate(
            id,
            {title,description},
            {new:true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:"Id is not found in Todo"})
        }
        res.json(updatedTodo)
    } catch (error) {
        res.status(400).json({message:error.message})  
    }
})

//delete the todo list
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id=req.params.id;
        const todos=await todoModel.findByIdAndDelete(id)
       
        res.json({message:id + " Deleted successfully"})
    } catch (error) {
        res.status(400).json({message:error.message})  
    }
})
const port=3000;
app.listen(port,()=>{
    console.log(`listening the port ${port}`);
    
})