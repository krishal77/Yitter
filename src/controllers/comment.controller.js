import mongoose, { isValidObjectId } from "mongoose";
import {Comment} from "../models/comment.model.js";
import { Video } from "../models/video.models.js";
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

const updateComment = asyncHandler(async (req, res) => {
 const {content}=req.body
 const{commentId}=req.params
  if(!content?.trim()){
        throw new ApiError(400,"comment is required");
    }
     const comment = await Comment.findById(commentId);
    
        if (!comment) {
            throw new ApiError(404, "Comment not found");
        }
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own comment");
    }

const updatedComment = await Comment.findByIdAndUpdate(commentId,{
    $set:{
        content: content.trim()
 } },
   {
            new: true
        }
)

return res.status(200).json(new ApiResponse(200,updatedComment,"comment successfully updated"))
})

const deleteComment= asyncHandler(async(req,res)=>{
    const {commentId}=req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment id")
    }

    const comment= await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment dosent exist");
    }
    if(comment.owner.toString()!==req.user._id.toString()){
         throw new ApiError(403, "You can only delete your own comment");
    }
    await Comment.findByIdAndDelete(commentId)

    return res.status(200).json(new ApiResponse(200,{},"comment successfully deleted"))
})
export {addComment,updateComment,deleteComment}