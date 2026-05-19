import {Router} from "express";
import { loginUser, 
    userRegister ,
      logoutUser,
      refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage,
    getChannelUserProfile} from "../controllers/user.controller.js";
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
router.route("/current-user").post(verifyJWT,getCurrentUser)
router.route("/update-account").post(verifyJWT,updateUserAvatar)
router.route("/avatar").post(verifyJWT,upload.single("avatar"),updateUserCoverImage)
router.route("/cover-image").post(verifyJWT, upload.single("coverImage"),getChannelUserProfile)



export default router 

