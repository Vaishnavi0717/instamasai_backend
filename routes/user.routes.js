const express=require("express"); 
const bcrypt=require("bcrypt"); 
const jwt=require("jsonwebtoken")
const {userModel} =require("../model/user.model")
const { blacklistModel} =require("../model/blacklist.model")


const userRouter=express.Router(); 

userRouter.post("/register", async(req, res)=>{
const {name, email, password, gender,age, is_married, city}= req.body;

let existingUser= await userModel.findOne({email});
if(existingUser){
    return res.status(400).send({"msg":"User already exist, please login"})
}

try {
bcrypt.hash(password, 5, async(err, hash)=>{
    if(err){
        res.status(400).send(err.message)
    }
    else{
        const user=new userModel({
            name, 
            email,
            gender, 
            age, 
            is_married, 
            city, 
            password:hash
        })
        await user.save()
        res.status(200).send({"msg":"New user has been registered", "new_user":user});
    }
})
} catch (error) {
    res.status(400).send(error)
}
})


userRouter.post("/login", async(req, res)=>{
    const{email, password}= req.body;
    try {
        const user=await userModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                if(result){
                    const token=jwt.sign({name:user.name, userId:user._id}, "token", {expiresIn:7});
                    res.status(200).send({"msg":"user has been login successfull", "token":token})

                }
                else{
                    res.status(400).send({"err":err.message})
                }
            })
        }
    } catch (error) {
        res.status(400).send(error)
    }
})


userRouter.get("/logout", async(req, res)=>{
    try {
        const token= req.headers.authorization?.split(" ")[1]; 
        const blocklist= new blacklistModel({"token":token});
        await blocklist.save(); 
        res.status(200).send({"msg":"user has been logout"})
    } catch (error) {
        res.status(400).send({"err":error})
    }
})


module.exports={
    userRouter
}