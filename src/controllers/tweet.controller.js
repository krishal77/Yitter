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

    return res.status(201).json(new ApiResponse(201,tweet,"tweet is created"))
})

export {createTweet}