import {Router} from "express";
import { loginUser, 
    userRegister ,
      logoutUser,
      refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage,
    getChannelUserProfile,
    getWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    
    userRegister)

router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT,changeCurrentPassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
router.route("/update-account").patch(verifyJWT,updateUserAvatar)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserCoverImage)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"),getChannelUserProfile)
router.route("/c/:username").get(verifyJWT,getChannelUserProfile)
router.route("/history").get(verifyJWT,getWatchHistory)


export default router 

