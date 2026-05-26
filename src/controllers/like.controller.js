import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Like} from "../models/like.model.js"
import {Comment} from "../models/comment.model.js";
import {Video} from "../models/video.models.js"
import {Tweet} from "../models/tweet.models.js"
const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params

if (!isValidObjectId(videoId)){
    throw new ApiError(400,"invalid video id")
}

const video= await Video.findById(videoId)
if(!video){
    throw new ApiError(404,"Video not found");
}

const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id,
    });

if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Video unliked"));
    }
 await Like.create({
        video: videoId,
        likedBy: req.user._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Video liked"));
})
