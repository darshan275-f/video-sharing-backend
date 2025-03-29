import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asynchandler} from "../utils/asynchandler.js";
import { fileUpload } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";



let generateAccessAndRefreshToken=async (userid)=>{
  
        
         try {
              let user=await User.findById(userid);
              let accessToken= user.generateAccessToken();
              let refreshToken= user.GenerateRefreshToken();
              user.refreshToken=refreshToken;
              await user.save({validateBeforeSave:false});
              return {accessToken,refreshToken};
         } catch (error) {
            throw new ApiError("Something went wrong while Generating Token"+error,500);
         }
   
        
}

let registerUser=asynchandler( async function (req,res) {

         // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {userName,email,fullName,password}=req.body;
        if(
            [userName,email,fullName,password].some((ele)=> ele?.trim()==="")
        )
        {
            throw new ApiError("Fields should not be empty",400);
        }

        const alreadyExist=await User.findOne({$or:[{email},{userName}]});
        if(alreadyExist){
            throw new ApiError("The user already Exist",400);
        }

        let avatarImgPath;
        if(req.files && Array.isArray(req.files.avatar)&&req.files.avatar.length>0){
            avatarImgPath=req.files.avatar[0].path;
        }
        let coverImagePath;
        if(req.files && Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
            coverImagePath=req.files.coverImage[0].path;
        }

        if(!avatarImgPath){
            throw new ApiError("Avatar Image is required");
        }

        let avatar=await fileUpload(avatarImgPath);
        let coverImg=await fileUpload(coverImagePath);

        const user=await User.create({
            fullName,
            userName,
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImg.url
        })

        const createdUser=await User.findById(user._id).select(
            "-password -refreshToken"
        )
        if(!createdUser){
            throw new ApiError("Something went wrong while registering user",500);
        }

        res.status(200).json(
           new ApiResponse(200,"Success",createdUser)
        )
})


let loginUser=asynchandler(async(req,res)=>{
          // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    let {email,userName,password}=req.body;
    if(!email && !userName){
        throw new ApiError("Email or userName is Empty",400);
    }
    const user =await User.findOne({
        $or:[{email},{userName}]
    })
    if(!user){
        throw new ApiError("You need to sign in first",400);
    }
    let passwordCheck=await user.isPasswordCorrect(password);
    if(!passwordCheck){
        throw new ApiError("Invalid Passowrd",400);
    }
    let {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    let options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,"Logged in successfully",
            {
                user:loggedInUser,accessToken,refreshToken
            }
        )
    )
})

let logOutUser=asynchandler(async(req,res)=>
{
        //clear the tokens and cookies
        await User.findByIdAndUpdate(req.user._id,{
           $set:{ "refreshToken":undefined}
        },{
            new:true
        })
        let options={
            httpOnly:true,
            secure:true
        }
       return  res.status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(
        new ApiResponse(200,"Logged out successfully",{})
       )


})

const refreshAccessToken=asynchandler(async(req,res)=>{
    let incomingRefreshToken=req.cookies?.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError("Unauthrozied Access",400);
    }
    let decodedrefreshToken=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
    try {
        let user=await User.findById(decodedrefreshToken?._id);
        if(!user){
            throw new ApiError("Invalid refresh token",401);
        }
        if(user?._refreshToken !== incomingRefreshToken){
            throw new ApiError("The Token is expired or incorrect",401);
        }
        let {accessToken,NewrefreshToken}=await generateAccessAndRefreshToken(user._id);
        let options={
            httpOnly:true,
            secure:true
        }
        res.status(200).cookie("refreshToken",NewrefreshToken,options).cookie("accessToken",accessToken,options).json(
            new ApiResponse(200,"Refreshed successfully!!",{
                accessToken,
                refreshToken:NewrefreshToken
            })
        )
    } catch (error) {
        throw new ApiError("Something went wrong while refreshing token!",500);
    }
    
})

const changePassword=asynchandler(async(req,res)=>{
    try {
         let {newPassword,oldPassword}=req.body;
            if(!newPassword){
                throw new ApiError("NewPassword is Empty",400);
            }
           
            const user=await User.findById(req?.user._id);
            const passwordVerify=await user.isPasswordCorrect(oldPassword);
            if(!passwordVerify){
                throw new ApiError("OldPassword is not correct",400);
            }
            user.password=newPassword;
           await user.save({validateBeforeSave:false});
           const userInfo=await User.findById(req?.user._id).select("-password -refreshToken");
    
           res.status(200).json(
            new ApiResponse(200,"Password Changed successfuly!!",userInfo)
           )
        
    } catch (error) {
        throw new ApiError("Something went wrong while changing Password",500);
    }

})

const changeAvatar=asynchandler(async(req,res)=>{
    try {
        const user=await User.findById(req?.user._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError("Unauthorized access",400);
        }
        let avatarPath=req.file?.path;
        console.log(req.file)
        if(!avatarPath){
            throw new ApiError("Upload Avatar Image",400);
        }
        const Avatar=await fileUpload(avatarPath);
        user.avatar=Avatar.url;
        await user.save({validateBeforeSave:false})
        res.status(200).json(
            new ApiResponse(200,"Avatar Chnaged Successfully!!",user)
        )
    } catch (error) {
        throw new ApiError("Something went wrong while changing Avatar",500);
    }
})

const changeCoverImage=asynchandler(async(req,res)=>{
 try {
       const user=await User.findById(req?.user._id).select("-password -refreshToken");
       if(!user){
           throw new ApiError("Unauthorized access",400);
       }
       let CoverPath=req.file?.path;
       console.log(req.file)
       if(!CoverPath){
           throw new ApiError("Upload Avatar Image",400);
       }
       const cover=await fileUpload(CoverPath);
       user.coverImage=cover.url;
       await user.save({validateBeforeSave:false})
       res.status(200).json(
           new ApiResponse(200,"Avatar Chnaged Successfully!!",user)
       )
 } catch (error) {
    throw new ApiError("Something went wrong while changing Cover Image",500);
 }
})

const changeInfo=asynchandler(async(req,res)=>{
    try {
        const {newEmail,newFullName} = req.body;
        if(!newEmail && !newFullName){
            throw new ApiError("Enter the field",401);
        }
        const user=await User.findById(req?.user._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError("unauthorized access!!",401);
        }
        if(newEmail){
            user.email=newEmail;
        }
        if(newFullName){
            user.fullName=newFullName;
        }
        await user.save({validateBeforeSave:false});
        res.status(200).json(
            new ApiResponse(200,"Fields updated Successfully!!",user)
        )
    
    } catch (error) {
        throw new ApiError("Something went wrong while changing Info",500);
    }

})


const getUserProfile=asynchandler(async(req,res)=>{
    const userName=req.params; // we get user from url 
    if(!userName?.trim()){
        throw new ApiError("User Not Found",400);
    }
    const user =await User.aggregate([
        {
            $match:userName?.trim(),
        },
        {
            $lookup:{
                from:"subscriptions", // from where
                localField:"_id",
                foreignField:"channel",// up and this line is used to join which will be on basis of _id==channel
                as:"Subscribers" // name of output
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"SubscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$Subscribers"
                },
                subscribedTOCount:{
                    $size:"$SubscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in: [req?.user._id,"$Subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                    
                }
            }
        },
        {
            $project:{
                fullName:1,
                userName:1,
                avatar:1,
                coverImage:1,
                subscribersCount:1,
                subscribedTOCount:1,
                isSubscribed:1
                


            }
        }
        
    ])
    if(!user?.length()){
        throw new ApiError("Channel not found",400)
    }
    return res.status(200).json(
        new ApiResponse(200,"Success",user[0])
    )

})

const watchHistory=asynchandler(async(req,res)=>{
    const history=await User.aggregate([
        {
        $match: {
            _id:new mongoose.Types.ObjectId(req.user._id)
        }
            
    },
    {
        $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"history",
            pipeline:[
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                            {
                                $project:{
                                    fullName:1,
                                    userName:1,
                                    avatar:1,
                                    coverImage:1
                                }
                            }
                        ]

                    }
                },
                {
                    $addFields:{
                        owner:{
                             $first:"$owner"
                        }
                       
                    }
                }
                
            ]
        }
    }
])
return res.status(200).json(
    new ApiResponse(200,"Success",history[0] || {})
)

})

export {registerUser,loginUser,logOutUser,refreshAccessToken,changePassword,changeAvatar,changeCoverImage,changeInfo,getUserProfile,watchHistory}