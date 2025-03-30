import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asynchandler} from "../utils/asynchandler.js";
// const getVideoComments = asynchandler(async (req, res) => {
//     //TODO: get all comments for a video
//     const {videoId} = req.params
//     const {page = 1, limit = 10} = req.query

// })

const addComment = asynchandler(async (req, res) => {
    
    // TODO: add a comment to a video
    const {videoID}=req.params;
    console.log(videoID);
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
     deleteComment
    }