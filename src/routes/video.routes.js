import { deleteVideo, getVideoByID, togglePublishStatus, updateVideo, videoUpload } from "../controllers/video.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
const videoRouter=Router();

videoRouter.route("/videoUpload").post(upload.fields([{
    name:"thumbnail",
    maxCount:1
},
{
    name:"video",
    maxCount:1
}]),verifyJwt,videoUpload)

videoRouter.route("/getVideo/:videoId").get(getVideoByID);


videoRouter.route("/updateVideo/:videoId").patch(verifyJwt,upload.fields([
    {
        name:"thumbnail",
        maxCount:1
    }
]),updateVideo);

videoRouter.route("/deleteVideo/:videoId").post(verifyJwt,deleteVideo);

videoRouter.route("/TogglePublish/:videoId").patch(verifyJwt,togglePublishStatus);

export default videoRouter;