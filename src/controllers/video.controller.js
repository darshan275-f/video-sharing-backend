import mongoose from 'mongoose';
import {Video} from '../models/video.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asynchandler } from '../utils/asynchandler.js';
import { fileUpload } from '../utils/cloudinary.js';
import { User } from '../models/user.models.js';


const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType} = req.query
    const {userId}=req.params
    //TODO: get all videos based on query, sort, pagination
    const aggregation = [
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) } // Match videos by owner ID
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "owner",
                as: "ownerDetails"
            }
        },
        {
            $unwind: "$ownerDetails" // Convert ownerDetails from array to object
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                videoFile: 1,
                thumbnail: 1,
                isPublished: 1,
                duration: 1,
                createdAt: 1,
                "ownerDetails._id": 1,
                "ownerDetails.fullName": 1,
                "ownerDetails.userName": 1,
                "ownerDetails.email": 1
            }
        },
        {
            $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } // Sort based on query params
        }
    ];
    

    let options={
        page:parseInt(page),
        limit:parseInt(limit),
        sort: { [sortBy]: sortType === "asc" ? 1 : -1 } 
    }
    const videos=await Video.aggregatePaginate(aggregation,options);
    if(!videos){
        throw new ApiError("Unable to fetch videos or user not found",500);
    }
    return res.status(200).json(
        new ApiResponse(200,"All Videos are fetched!!",videos)
    )
})



const videoUpload=asynchandler(async(req,res)=>{
    const {title,description,isPublished} = req.body;
    if(!title || !description){
        throw new ApiError("All fields are required",400);
    }
    let thumbnailPath;
    if (!req.files || !req.files.thumbnail) {
        throw new ApiError("thumbnail file is required", 400);
    }

    if (req.files && req.files.thumbnail && req.files.thumbnail.length>0) {
        thumbnailPath=req.files.thumbnail[0].path;
    }

    let videoPath;
    if (!req.files || !req.files.video) {
        throw new ApiError("Video file is required", 400);
    }
    if(req.files&&req.files.video&&req.files.video.length>0)
    {
        videoPath=req.files.video[0].path;
    }
    let thumbnailUrl=await fileUpload(thumbnailPath);
    let videoUrl=await fileUpload(videoPath);
    let video=await Video.create({
        title:title,
        description:description,
        videoFile:videoUrl.url,
        thumbnail:thumbnailUrl.url,
        isPublished:isPublished,
        duration:videoUrl.duration,
        owner:req?.user._id
    })
    return res.status(200).json(
        new ApiResponse(200,"Video Uploded SuccessFully",video)
    )
})

const getVideoByID=asynchandler(async(req,res)=>{
    const {videoId}=req.params;
    const video=await Video.aggregate([
        {
        $match:{
            _id:new mongoose.Types.ObjectId(videoId)
        }
    },
    {
        $lookup:{
            from:"users",
            foreignField:"_id",
            localField:"owner",
            as:"Owner",
        pipeline:[{
            $project:{
                fullName:1,
                userName:1,
            }
        },
       ]
        }
    },
    {
        $addFields: {
            Owner: { $first:"$Owner" } // Extract first element
        }
    },
    
])

console.log(video[0]);
if(!video || video?.length<=0){
    throw new ApiError("No Video Found",400);
}

if(video.isPublished==false){
    throw new ApiError("Video is not published or it is private",400);
}
return res.status(200).json(
    new ApiResponse(200,"Success",video[0])
)


})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const isOwner=await Video.findById(videoId);
    if(!isOwner){
        throw new ApiError("Owner Not Found!!",400);
    }
    if(!req.user){
        throw new ApiError("please sign or login ",400);
    }
    if(!isOwner?.owner.equals(req?.user._id)){
        throw new ApiError("Unauthorized Access || You are not owner of this video",400)
    }


    const {newTitle,newDescription}=req.body;
    if(!newTitle || !newDescription){
        throw new ApiError("All fields are required",400);
    }
    let newThumbPath;
    if (!req.files || !req.files.thumbnail) {
        throw new ApiError("thumbnail file is required", 400);
    }
    if(req.files && req.files.thumbnail && req.files.thumbnail.length>0){
        newThumbPath=req.files.thumbnail[0].path;
    }
    const newThumb=await fileUpload(newThumbPath);
    const video=await Video.findByIdAndUpdate(videoId,{
        $set:{
            title:newTitle,
            description:newDescription,
            thumbnail:newThumb.url
        }
    },{
        new:true
    })
    if(!video){
        throw new ApiError("Unable to update video details",500);
    }
 
    return res.status(200).json(
        new ApiResponse(200,"Video Details Updated",video)
    )


})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const isOwner=await Video.findById(videoId);
    if(!isOwner){
        throw new ApiError("Owner Not Found!!",400);
    }
    if(!req.user){
        throw new ApiError("please sign or login ",400);
    }
    if(!isOwner?.owner.equals(req?.user._id)){
        throw new ApiError("Unauthorized Access || You are not owner of this video",400)
    }


    const video=await Video.findByIdAndDelete(videoId);
    if(!video ){
        throw new ApiError("There is No such Video",400);
    }
    return res.status(200).json(
        new ApiResponse(200,"Video Deleted Successfully",{})
    )
})

const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params;
    const isOwner=await Video.findById(videoId);
    if(!isOwner){
        throw new ApiError("Owner Not Found!!",400);
    }
    if(!req.user){
        throw new ApiError("please sign or login ",400);
    }
    if(!isOwner?.owner.equals(req?.user._id)){
        throw new ApiError("Unauthorized Access || You are not owner of this video",400)
    }



    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError("Video Not Found",400);
    }
        
        video.isPublished=!video.isPublished;
   
    await video.save({validateBeforeSave:false});
    return res.status(200).json(
        new ApiResponse(200,"Publish status Changed",video)
    )
})

 
export {videoUpload,getVideoByID,updateVideo,deleteVideo,togglePublishStatus,getAllVideos}