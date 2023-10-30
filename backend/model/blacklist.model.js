const mongoose= require("mongoose"); 

const blacklistSchema=mongoose.Schema({
    token:String
}, {
    versionKey:false
})


const blacklistModel=mongoose.model("blocklist", blacklistSchema); 

module.exports={
    blacklistModel
}