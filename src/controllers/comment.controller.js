import mongoose from "mongoose";
import {Comment} from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment= asyncHandler(async(req,res)=>{
    const{content}=req.body
    const { videoId } = req.params;
    if(!content?.trim()){
        throw new ApiError(400,"comment is required");
    }
     if (!videoId) {
        throw new ApiError(400, "Video ID is required");
    }
const video = await Video.findById(videoId);
if (!video) {
    throw new ApiError(404, "Video not found");
}
const comment = await Comment.create({
        content,
        video:videoId,
        owner: req.user._id
    });
    

    return res.status(201).json(
        new ApiResponse(201, comment, "Comment added successfully")
    );
})

export {addComment}