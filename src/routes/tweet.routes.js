import { Router } from "express";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
import { createTweet, deleteTweet, getUserTweetsById, updateTweet } from "../controllers/tweet.controller.js";
const tweetRouter=Router();

tweetRouter.route("/createTweet").post(verifyJwt,createTweet);

tweetRouter.route("/getTweet/:tweetId").get(getUserTweetsById);

tweetRouter.route("/updateTweet/:tweetId").patch(verifyJwt,updateTweet);

tweetRouter.route("/deleteTweet/:tweetId").post(verifyJwt,deleteTweet);

export default tweetRouter;
