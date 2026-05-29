import mongoose, { isValidObjectId } from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video} from "../models/video.models.js"
import {Subscription} from "../models/subscriptions.models.js"
import {Like} from "../models/like.model.js"
import {User} from "../models/user.models.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user?._id

    if (!channelId) {
        throw new ApiError(401, "Unauthorized request")
    }

    // Total videos
    const totalVideos = await Video.countDocuments({
        owner: channelId
    })

    // Total video views
    const totalViewsResult = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])

    const totalViews = totalViewsResult[0]?.totalViews || 0

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: channelId
    })

    // Get all video ids of this channel
    const channelVideos = await Video.find({
        owner: channelId
    }).select("_id")

    const videoIds = channelVideos.map(video => video._id)

    // Total likes on all videos
    const totalLikes = await Like.countDocuments({
        video: {
            $in: videoIds
        }
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalSubscribers,
                totalLikes
            },
            "Channel stats fetched successfully"
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user?._id

    if (!channelId) {
        throw new ApiError(401, "Unauthorized request")
    }

    const videos = await Video.find({
        owner: channelId
    }).sort({
        createdAt: -1
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Channel videos fetched successfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }
