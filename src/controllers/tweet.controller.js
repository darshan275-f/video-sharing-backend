import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asynchandler} from "../utils/asynchandler.js";
import { Tweet } from "../models/tweet.models.js";
import mongoose from "mongoose";

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body;
    if(!content){
        throw new ApiError("Content is required!!",400);
    }
    if(!req.user){
        throw new ApiError("Please login or signin first",400);
    }
    const tweet=await Tweet.create({
        content,
        owner:req.user._id
    })
    if(!tweet){
        throw new ApiError("something went wrong while creating tweet",500);
    }
    return res.status(200).json(
        new ApiResponse(200,"Tweet created successfully",tweet)
    )
})

const getUserTweetsById= asynchandler(async (req, res) => {
    // TODO: get user tweets
    const {tweetId}=req.params;
    const tweet=await Tweet.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(tweetId)
            },
            
        },
        {
            $lookup:{
                from:"users",
                foreignField:"_id",
                localField:"owner",
                as:"Owner",
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            userName:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                Owner:{
                    $arrayElemAt:["$Owner",0]
                }
            }
        }
    ]);
    if(!tweet[0]){
        throw new ApiError("Error while getting tweet",500);
    }
    return res.status(200).json(
        new ApiResponse(200,"Success",tweet[0])
    )
})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params;
    const {newContent}=req.body;
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError("NO tweet found",400);
    }
    if(!newContent){
        throw new ApiError("New Content Required",400);
    }
    if(!req.user){
        throw new ApiError("Login or signin first",400);
    }
    if(!req.user._id.equals(tweet.owner)){
        throw new ApiError("you are not owner of this tweet",400);
    }
    tweet.content=newContent;
    await tweet.save();
    res.status(200).json(new ApiResponse(200,"Tweet Updated SuceessFully",tweet));    
    
})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params;
    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError("NO tweet found",400);
    }
    if(!req.user){
        throw new ApiError("Login or signin first",400);
    }
    if(!req.user._id.equals(tweet.owner)){
        throw new ApiError("you are not owner of this tweet",400);
    }
    await Tweet.findByIdAndDelete(tweetId);
    res.status(200).json(new ApiResponse(200,"Tweet Deleted successfully",{}));
})

export {
    createTweet,
    getUserTweetsById,
    updateTweet,
    deleteTweet
}