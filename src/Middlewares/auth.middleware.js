
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import Jwt from  "jsonwebtoken";


export const verifyJwt=asynchandler(async (req,_,next)=>{
        

            let token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
            if(!token){
                throw new ApiError("Unauthrozied Access",401);
            }
            let decodedToken= Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
            let user =await User.findById(decodedToken?._id).select("-password -refreshToken");
            if(!user){
                throw new ApiError("Invalid access Token",401);
            }
            req.user=user;
            
            next();

       
       
})