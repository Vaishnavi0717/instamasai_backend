const jwt=require("jsonwebtoken"); 
const {blacklistModel} =require("../model/blacklist.model")

const auth=async(req, res, next)=>{
    const token=req.headers.authorization?.split(" ")[1]; 

    if(token){
        const foundToken=await blacklistModel.findOne({"token":token});
        if(foundToken){
            res.status(200).send({"msg":"please login again"})
            return;
        }
        else{
            jwt.verify(token, "token", (err, decode)=>{
                if(decode){
                    req.body.name=decode.name; 
                    req.body.userId=decode.userId
                    next()
                }
                else{
                    res.status(400).send({"msg":"user is not authorized", "err":err})
                }
            })
        }
    }
    else{
        res.status(400).send({"error":error})
    }

}

module.exports={
    auth
}