import { Router } from "express";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
const subRouter=Router();

subRouter.route("/toggleSub/:channelId").post(verifyJwt,toggleSubscription);

subRouter.route("/getChannelSub/:channelId").get(getUserChannelSubscribers);

subRouter.route("/getSubChannel/:subscriberId").get(getSubscribedChannels);

export default subRouter;

