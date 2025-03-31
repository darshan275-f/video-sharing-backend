import { asynchandler } from "../utils/asynchandler.js"
import { Subscription } from "../models/subscription.models.js"

import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const toggleSubscription = asynchandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError("Invalid channel ID", 400);
    }
    if (!req.user) {
        throw new ApiError("Login or signin First");
    }
    // TODO: toggle subscription
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError("Channel doesn't exist", 400);
    }
    const isSubscribed = await Subscription.findOne({ subscriber: req.user._id,channel: channelId });
    if (isSubscribed) {
        await Subscription.findOneAndDelete({ subscriber:req.user._id, channel: channelId });
        return res.status(200).json(
            new ApiResponse(200, "Unsubscribed Successfully", null)
        )
    }
    const result = await Subscription.create({
        channel: channelId,
        subscriber: req?.user._id
    })
    return res.status(200).json(new ApiResponse(200, "Subscribed Successfully!!", result));

})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError("Invalid channel ID", 400);
    }
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError("Channel doesn't exist", 400);
    }
    const result = await Subscription.aggregate([{
        $match: {
            channel: new mongoose.Types.ObjectId(channelId)
        }
    },
    {
        $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "subscriber",
            as: "subscriberDetails"
        }
    },
    {
        $unwind:"$subscriberDetails"
    },
    {
        $project: {
            "subscriberDetails._id": 1,
            "subscriberDetails.name": 1,
            "subscriberDetails.email": 1,
            "subscriberDetails.fullName": 1
        }
    }
    ])

    if (!result.length) {
        return res.status(200).json(new ApiResponse(200, "No data found", []));
    }
    return res.status(200).json(new ApiResponse(200, "All subscribers details fetched", result))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError("Invalid channel ID", 400);
    }
    const isSubscriberExist = await User.findById(subscriberId);
    if (!isSubscriberExist) {
        throw new ApiError("subscriber doesn't exist", 400);
    }

    const result = await Subscription.aggregate([{
        $match: {
            subscriber: new mongoose.Types.ObjectId(subscriberId)
        }
    },
    {
        $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "channel",
            as: "ChannelDetails"
        }
    },
    {

        $unwind:"$ChannelDetails"
    },
    {
        $project: {
            "ChannelDetails._id": 1,
            "ChannelDetails.name": 1,
            "ChannelDetails.email": 1,
            "ChannelDetails.fullName": 1
        }
    }
    ])
    if (!result.length) {
        return res.status(200).json(new ApiResponse(200, "No data found", []));
    }
    return res.status(200).json(new ApiResponse(200, "All channels details fetched", result))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}