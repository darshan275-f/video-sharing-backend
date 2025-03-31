import mongoose from "mongoose";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asynchandler} from "../utils/asynchandler.js";
const getVideoComments = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if the video exists
    const videoExists = await Video.findById(videoId);
    if (!videoExists) {
        throw new ApiError("Video not found", 404);
    }

    // Aggregation query to fetch comments with user details
    const aggregation = [
        {
            $match: { video: new mongoose.Types.ObjectId(videoId) } // Ensure correct field name
        },
        {
            $lookup: {
                from: "users", // Reference to the User collection
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "$ownerDetails" // Convert array into an object
        },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                "ownerDetails._id": 1,
                "ownerDetails.fullName": 1,
                "ownerDetails.userName": 1
            }
        }
    ];

    // Pagination options
    let options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    // Fetch paginated comments
    const comments = await Comment.aggregatePaginate(Comment.aggregate(aggregation), options);

    if (!comments || comments.docs.length === 0) {
        throw new ApiError("No comments found for this video", 404);
    }

    return res.status(200).json(
        new ApiResponse(200, "All comments fetched successfully", comments)
    );
});


const addComment = asynchandler(async (req, res) => {
    
    // TODO: add a comment to a video
    const {videoID}=req.params;
    const video = await Video.findById(videoID);
    if(!video){
        throw new ApiError("Video is not found",400);
    }
    const {content}=req.body;
    if(!content){
        throw new ApiError("Content required!!",400);
    }

    if(!req.user){
        throw new ApiError("Please sign in or login first",400);
    }

    const comment=await Comment.create({
        content,
        video:video._id,
        owner:req.user._id

    })
    if(!comment){
        throw new ApiError("Error while Adding comment to video",500);
    }
    return res.status(200).json(new ApiResponse(200,"Comment added",comment))

})

const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
   const {commentId}=req.params;
   const {newContent}=req.body;
   if(!newContent){
    throw new ApiError("New Content is required!!",400);
   }
   const comment=await Comment.findById(commentId);
   if(!comment){
    throw new ApiError("There is no such Comment",400);
   }
   if(!req.user){
    throw new ApiError("please Login or signin first",400);
   }
   if(!req.user._id.equals(comment.owner)){
        throw new ApiError("You are not owner of this comment",400);
   }
   comment.content=newContent;
   await comment.save({validateBeforeSave:false});
   return res.status(200).json(
    new ApiResponse(200,"Successfully updated comment",comment)
   )

})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params;
    const comment=await Comment.findById(commentId);
    if(!comment){
        throw new ApiError("There is no such comment",400);
    }
    if(!req.user){
        throw new ApiError("Please signin or login first",400);
    }
    if(!req.user._id.equals(comment.owner)){
        throw new ApiError("You are not owner of This comment",400);
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json(
        new ApiResponse(200,"Comment deleted Successfully",{})
    )
})

export {
 
    addComment, 
    updateComment,
     deleteComment,
     getVideoComments
    }