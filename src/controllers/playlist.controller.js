import mongoose, { isValidObjectId } from "mongoose";
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

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User Id")
    }
   const playlist= await Playlist.find({owner:userId}).populate("videos").sort({ createdAt: -1 });

   return res.status(200).json(new ApiResponse(200,playlist,"playlist returned"))


})
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!isValidObjectId(playlistId)){
        throw new ApiError(200,"Invalid playlist id");
    }
    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res.status(200).json(new ApiResponse(200,playlist,"playlist fetched successfully"))
})

export {createPlaylist,getUserPlaylists,getPlaylistById}