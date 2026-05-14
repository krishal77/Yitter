import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const userRegister= asyncHandler(async(req,res)=>{
 const {username,email,fullName,password} = req.body
   
 if([username,email,fullName,password].some((field)=>
field?.trim()==="") // throws error even if 1 field is empty after removing spaces
){
    throw new ApiError(400,"All fields are required");
}
 
const existedUser = User.findOne({
    $or: [{ username }, { email }]
}); // Checks whether a user with the same username or email already exists in the database. findOne() first matching document
if(existedUser){
    throw new ApiError(409,"User already existed")
}

const avatarLocalPath =req.files?.avatar[0]?.path;
const coverImageLocalPath=req.files?.coverImage[0]?.path;

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar Image is required")
}
const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage= await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"Avatar file is required")
}

const user= await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password
})
  const createrUser=await User.findById(user._id).select(
    " -password -refreshToken"
  )

  if(!createrUser){
    throw new ApiError(500,"something went wrong while creating user")
  }
  return res.status(201).json(
    new ApiResponse(200,createrUser,"User Registered Successfully!!!")
  )


})
 
export {userRegister} 