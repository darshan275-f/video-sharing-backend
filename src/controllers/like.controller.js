import { Like } from "../models/like.models.js"
import { Tweet } from "../models/tweet.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js"
import { Comment } from "../models/comment.models.js";
import mongoose from "mongoose";

const toggleVideoLike = asynchandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!req.user){
        throw new ApiError("Login or signin first",400);
    }
    const user=req?.user._id;
    const isVideoExist=await Video.findById(videoId);
    if(!isVideoExist){
        throw new ApiError("Video doesn't exist",400);
    }

    const isExistLike=await Like.findOne({
        video:videoId,
        likedBy:user
    })

    if(isExistLike){
       const deletedLike=await Like.findByIdAndDelete(isExistLike._id,{new:true})
        return res.status(200).json(
            new ApiResponse(200,"Unliked",deletedLike)
        )
    }
    const like=await Like.create({
        video:videoId,
        likedBy:user
    })
  
   return res.status(200).json(
        new ApiResponse(200,"liked",like)
    )
    
})

const toggleCommentLike = asynchandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!req.user){
        throw new ApiError("Login or signin first",400);
    }
    const comment =await Comment.findById(commentId);
    if(!comment){
        throw new ApiError("Unable to find comment",400);
    }
    const commentIsExist=await Like.findOne({
        comment:commentId,
        likedBy:req?.user._id
    })
    if(commentIsExist){
        const deletedLike=await Like.findByIdAndDelete(commentIsExist._id,{new:true})
        return res.status(200).json(new ApiResponse(200,"Unliked",deletedLike));
    }
    const likeComment=await Like.create({
        comment:commentId,
        likedBy:req?.user._id
    })
    return res.status(200).json(new ApiResponse(200,"Liked",likeComment))

})

const toggleTweetLike = asynchandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!req.user){
        throw new ApiError("Login or signin first",400);
    }

    const tweet =await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError("Unable to find tweet",400);
    }
    const tweetIsExist=await Like.findOne({
        tweet:tweetId,
        likedBy:req?.user._id
    })
    if(tweetIsExist){
        const deletedLike=await Like.findByIdAndDelete(tweetIsExist._id,{new:true})
        return res.status(200).json(new ApiResponse(200,"Unliked",deletedLike));
    }
    const likeTweet=await Like.create({
        tweet:tweetId,
        likedBy:req?.user._id
    })
    return res.status(200).json(new ApiResponse(200,"Liked",likeTweet))
}
)

const getLikedVideos = asynchandler(async (req, res) => {
    //TODO: get all liked videos
    if(!req.user){
        throw new ApiError("Login or signin first",400);
    }
    const user=req?.user._id;
    const LikedVideos=await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(user._id),
                
            }
        },
        {
            $lookup:{
                from:"videos",
                foreignField:"_id",
                localField:"video",
                as:"allLikedVideos",
                pipeline:[
                    {
                        $project:{
                            _id:1,
                            videoFile:1,
                            thumbnail:1,
                            title:1,
                            description:1
                        }
                    }
                ]
            }
        },
        {
            $match: {
                allLikedVideos: { $ne: [] }  // Ensure only liked videos are considered  ||This filters out documents where allLikedVideos is an empty array ([]).
            }
        },
        {
            $addFields:{
                allLikedVideos:{
                    $first:"$allLikedVideos"
                }
            }
        },
        
    ])
    
    if(LikedVideos.length<=0){
        throw new ApiError("Not Able to fetch Liked videos or There are no liked videos",500);
    }
    return res.status(200).json(new ApiResponse(200,"All liked videos are fetched",LikedVideos))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}