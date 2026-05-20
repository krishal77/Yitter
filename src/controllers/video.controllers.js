import mongoose, {isValidObjectId} from "mongoose"
import { User } from "../models/user.models.js"
import{Video} from "../models/video.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"


const publishAVideo= asyncHandler(async(req,res)=>{
    const {title,description}=req.body

    if([title,description].some((field)=>
field?.trim()==="")){
        throw new ApiError(400,"title and desciption are required")
    }
    const localThumbnailPath=req.files?.thumbnail[0]?.path
    const localVideoPath=req.files?.video[0]?.path
    if(!localVideoPath){
        throw new ApiError(400,"video is required")
    }
    if(!localThumbnailPath){
        throw new ApiError(400,"Thumbnail is required")
    }

    const uploadedVideo=await uploadOnCloudinary(localVideoPath)
    if(!uploadedVideo){
        throw new ApiError(500,"Error while uploading video")
    }
    const thumbnail=await uploadOnCloudinary(localThumbnailPath)
     if(!thumbnail){
        throw new ApiError(500,"Error while uploading video")
    }
    const video= await Video.create({
        videoFile:uploadedVideo.url,
        title,
        description,
        thumbnail: thumbnail.url,
        duration:uploadedVideo.duration || 0,
        owner: req.user._id 
    })
return res.status(201).json(new ApiResponse(200,video,"video uploaded successfully!!"))
})

export {publishAVideo}