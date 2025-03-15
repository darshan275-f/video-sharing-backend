import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponseError } from "../utils/ApiResponseError.js";
import {asynchandler} from "../utils/asynchandler.js";
import { fileUpload } from "../utils/cloudinary.js";



let generateAccessAndRefreshToken=async (userid)=>{
     try {
           let user=await User.findById(userid);
           let accessToken=user.generateAccessToken();
           let refreshToken=user.GenerateRefreshToken();
           user.refreshToken=refreshToken;
           await user.save({validateBeforeSave:false});
           return {accessToken,refreshToken};
     } catch (error) {
        throw new ApiError(500,"Error to generate Token");
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
            throw new ApiError("Something went wrong while registering user");
        }

        res.status(200).json(
           new ApiResponseError(200,"Success",createdUser)
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
        throw new ApiError(400,"Email or userName is Empty");
    }
    const user =await User.findOne({
        $or:[{email},{userName}]
    })
    if(!user){
        throw new ApiError(400,"You need to sign in first");
    }
    let passwordCheck=await user.isPasswordCorrect(password);
    if(!passwordCheck){
        throw new ApiError(400,"Invalid Passowrd");
    }
    let {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    console.log(accessToken);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    let options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponseError(200,"Logged in successfully",
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
        new ApiResponseError(200,"Logged out successfully",{})
       )


})

export {registerUser,loginUser,logOutUser}