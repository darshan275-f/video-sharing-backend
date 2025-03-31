import { Router } from "express";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";
const likeRouter=Router();

likeRouter.route("/toggleVideoLike/:videoId").post(verifyJwt,toggleVideoLike);

likeRouter.route("/toggleCommentLike/:commentId").post(verifyJwt,toggleCommentLike);

likeRouter.route("/toggleTweetLike/:tweetId").post(verifyJwt,toggleTweetLike);

likeRouter.route("/getLikedVideos").get(verifyJwt,getLikedVideos);

export default likeRouter;