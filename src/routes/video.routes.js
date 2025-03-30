import { deleteVideo, getVideoByID, togglePublishStatus, updateVideo, videoUpload } from "../controllers/video.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
const Videorouter=Router();

Videorouter.route("/videoUpload").post(upload.fields([{
    name:"thumbnail",
    maxCount:1
},
{
    name:"video",
    maxCount:1
}]),verifyJwt,videoUpload)

Videorouter.route("/getVideo/:videoId").get(getVideoByID);


Videorouter.route("/updateVideo/:videoId").patch(verifyJwt,upload.fields([
    {
        name:"thumbnail",
        maxCount:1
    }
]),updateVideo);

Videorouter.route("/deleteVideo/:videoId").post(verifyJwt,deleteVideo);

Videorouter.route("/TogglePublish/:videoId").patch(verifyJwt,togglePublishStatus);

export default Videorouter;