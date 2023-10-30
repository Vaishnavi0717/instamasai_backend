const express= require("express"); 
const {postModel} = require("../model/post.model")
const {auth} =require("../middleware/auth.middleware")


const postRouter=express.Router(); 

postRouter.use(auth); 

postRouter.get("/", async(req, res)=>{
    try {
        const newpost=await postModel.find({name:req.body.name}); 
        res.status(200).send(newpost)
    } catch (error) {
        res.status(400).send({"err":error})
    }
})


postRouter.post("/add", async(req, res)=>{
    try {
        const newpost= new postModel(req.body); 
        await newpost.save(); 
        res.status(200).send({"msg":"new post has been created", "new_post":newpost})
    } catch (error) {
        res.status(400).send({"err":error})
    }
})


postRouter.patch("/update/:userId", async(req, res)=>{
    const {id}=req.params; 
    const newpost=await postModel.findOne({_id:id});

    try {
        if(req.body.userId===newpost.userId){
            await postModel.findByIdAndUpdate({_id:id}, req.body);
            res.status(200).send({"msg":"the note has been updated"})
        }
        else{
            res.status(400).send({"msg":"you are not authorized"})
        }
    } catch (error) {
        res.status(400).send({"err":error})
    }
})


postRouter.delete("/update/:userId", async(req, res)=>{
    const {id}=req.params; 
    const newpost=await postModel.findOne({_id:id});

    try {
        if(req.body.userId===newpost.userId){
            await postModel.findByIdAndDelete({_id:id});
            res.status(200).send({"msg":"the note has been deleted"})
        }
        else{
            res.status(400).send({"msg":"you are not authorized"})
        }
    } catch (error) {
        res.status(400).send({"err":error})
    }
})



module.exports={
    postRouter
}