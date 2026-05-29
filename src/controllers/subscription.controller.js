import mongoose, { isValidObjectId } from "mongoose";
import { ApiError} from "../utils/ApiError.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Subscription} from "../models/subscriptions.models.js"
import {User} from "../models/user.models.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
  if(!isValidObjectId(channelId)){
    throw new ApiError(400,"Invalid channel id")
  }
  const subscribed= await Subscription.findOne({
    subscriber:req.user?._id,
    channel:channelId
  })
  if(subscribed){
    await Subscription.findByIdAndDelete(subscribed._id)
       return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        )
  }

  await Subscription.create({
    subscriber:req.user?._id,
    channel:channelId
  })
  return res.status(200).json(
        new ApiResponse(200, {}, "Subscribed successfully")
  )
})