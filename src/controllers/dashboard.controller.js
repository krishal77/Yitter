import mongoose, { isValidObjectId } from "mongoose"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video} from "../models/video.models.js"
import {Subscription} from "../models/subscriptions.models.js"
import {Like} from "../models/like.model.js"
import {User} from "../models/user.models.js"

const getChannelStats = asyncHandler(async (req, res) => {
const { userId } = req.params

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
     const videos = await Video.find({ owner: userId })
     const totalVideos = videos.length
     const totalViews = videos.reduce(
        (acc, video) => acc + (video.views || 0),
        0
    )
 const videoIds = videos.map(video => video._id)
   const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    })
     const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })
return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalLikes,
                totalSubscribers
            },
            "Channel stats fetched successfully"
        )
    )
})





const getChannelVideos = asyncHandler(async (req, res) => {
    const {userId}=req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid user id")
    }
    const user= await User.findById(userId)
   if(!user){
    throw new ApiError(404,"user not found")
   }
   const video=await Video.find({owner:userId}).sort({ createdAt: -1 })

   if (video.length === 0) {
    throw new ApiError(404, "No videos found")
}

   return res.status(200).json(new ApiResponse(200,video,"all videos fetched"))
})

export {
    getChannelStats, 
    getChannelVideos
    }
