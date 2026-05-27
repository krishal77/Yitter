import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Playlist} from "../models/playlist.model.js"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    
    if((!name||!description)){
        throw new ApiError(400,"Field cant be empty");
    }
    if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized");
}
    const playlist=await Playlist.create({
        name,
        description,
        owner:req.user._id,
        videos:[]
    })
    return res.status(201).json(new ApiResponse(201,playlist,"Playlist Created Successfully"))
})

export {createPlaylist}