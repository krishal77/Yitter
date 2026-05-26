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

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

   
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "Comment unliked"));
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true }, "Comment liked")); 
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
   if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res
            .status(200)
            .json(new ApiResponse(200, { isLiked: false }, "tweet unliked"));
    }

     await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
    });
return res
        .status(200)
        .json(new ApiResponse(200, { isLiked: true, likeId: newLike._id }, "tweet liked")); 
}
);