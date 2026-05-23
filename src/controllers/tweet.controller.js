import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.models.js"
import { Tweet } from "../models/tweet.model.js";
import mongoose,{isValidObjectId} from "mongoose";

const createTweet = asyncHandler(async(req,res)=>{
    const {content} =req.body
    if(!content || content.trim() === ""){
        throw new ApiError(400,"Content is required")
    }

    const tweet=await Tweet.create({
        content,
        owner: req.user?._id 
    })
    if(!tweet){
         throw new ApiError(500,"something went wrong while creating tweet")
    }

    return res.status(201).json(new ApiResponse(201,tweet,"tweet is created"))
})

const updatedTweet = asyncHandler(async (req, res) => {
    const {content}=req.body
    const { tweetId } = req.params;
    if(!content || content.trim() === ""){
        throw new ApiError(400,"Content is required")
    }
     if (!req.user) {
        throw new ApiError(401, "Unauthorized");
    }

     const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own tweet");
    }
       const updateTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {
            $set: {
                content: content.trim()
            }
        },
        {
            new: true
        }
    );


    return res.status(200).json(new ApiResponse(200,updateTweet,"tweet is updated"))
})
const deleteTweet = asyncHandler(async (req, res) => {
   const{tweetId}=req.params
  if(!isValidObjectId(tweetId)){
    throw new ApiError(400, "Invalid tweet id")
}

const tweet= await Tweet.findById(tweetId)
if(!tweet){
    throw new ApiError(404,"tweet is not found")
}
if(tweet.owner.toString()!==req.user._id.toString())
{
     throw new ApiError(403,"You cant delete this tweet")
}
await Tweet.findByIdAndDelete(tweetId)

return res.status(200).json(new ApiResponse(200,{},"tweet is deleted successfully"))


})
export {createTweet,updatedTweet,deleteTweet}