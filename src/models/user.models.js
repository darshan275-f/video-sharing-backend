import mongoose  from "mongoose";
import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken";

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String,
    
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ]


},{timestamps:true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


userSchema.methods.isPasswordCorrect=async function(password){
        return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.GenerateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_SECRET
        }
    )
}

export const User=mongoose.model("User",userSchema);