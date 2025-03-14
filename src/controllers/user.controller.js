import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponseError } from "../utils/ApiResponseError.js";
import {asynchandler} from "../utils/asynchandler.js";
import { fileUpload } from "../utils/cloudinary.js";

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

        const avatarImgPath=req.files?.avatar[0]?.path;
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

export {registerUser}