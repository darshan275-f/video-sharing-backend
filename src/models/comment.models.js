import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true});

export const Comment=mongoose.model("Comment",commentSchema);