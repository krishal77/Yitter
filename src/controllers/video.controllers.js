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
        throw new ApiError(500,"Error while uploading thumbnail")
    }
    const video= await Video.create({
        videoFile:uploadedVideo.url,
        title,
        description,
        thumbnail: thumbnail.url,
        duration:uploadedVideo.duration || 0,
        owner: req.user._id 
    })
return res.status(201).json(new ApiResponse(201,video,"video uploaded successfully!!"))
})
const updateVideo= asyncHandler(async(req,res)=>{
    
    const {videoId}= req.params

    if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video id")
}
    const{title,description}=req.body
    if(!title || !description){
       throw new ApiError(400,"Both title and description is required")
    }
    const newThumbnaiLocalPath=req.file?.path
    console.log(req.file)
    if(!newThumbnaiLocalPath){
        throw new ApiError(400,"thumbnail is missing")
    }
    //to verify user
    const video = await Video.findById(videoId)
if(!video){
    throw new ApiError(404, "Video not found")
}
if(video.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "You can't update this video")
}

    const newThumbnail= await uploadOnCloudinary(newThumbnaiLocalPath)
    if(!newThumbnail){
       throw new ApiError(400,"Error while uploading thumbnail")
    }
    const updatedVideo=await Video.findByIdAndUpdate(videoId,{
        $set:{
            title,
            description,
            thumbnail:newThumbnail.url
        }
       
    }, {
            new:true
        })
 
    return res.status(200).json(new ApiResponse(200,updatedVideo,"video updated successfully!"))
})
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
    throw new ApiError(400, "Invalid video id")
}
const video= await Video.findById(videoId)
if(!video){
    throw new ApiError(404,"video not found")
}
if(video.owner.toString()!==req.user._id.toString()){
    throw new ApiError(403,"You cant delete this video")
}

await Video.findByIdAndDelete(videoId)
//should also delete from cloudinary, will do later
return res.status(200).json(new ApiResponse(200,{},"Video deleted successfully"))
})
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"No video found")
    }

   const updatedVideo= await Video.findByIdAndUpdate(videoId,{
        $set:{
            isPublished:!video.isPublished
        }
    },{
        new:true
    })
    return res.status(200).json(new ApiResponse(200,updatedVideo,"successfully toggled"));
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid video id")
    }
   const video = await Video.findById(videoId).select(
        "title description views duration isPublished owner"
    );
    if(!video){
        throw new ApiError(404,"no video found")
    }
   
    return res.status(200).json(new ApiResponse(200,video,"video found successfully"))
})
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    const filter = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
     if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }
        filter.owner = userId;
    }
     filter.isPublished = true; 
     const sortOptions = {};
    sortOptions[sortBy || "createdAt"] = sortType === "asc" ? 1 : -1;
     const skip = (Number(page) - 1) * Number(limit);

      const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .select("title description views duration isPublished owner createdAt");
const totalVideos = await Video.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalVideos,
            currentPage: Number(page),
            totalPages: Math.ceil(totalVideos /Number(limit) )
        }, "Videos fetched successfully")
    );
});

export {publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideoById,
    getAllVideos}