import { Router } from "express";
import { publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus} from "../controllers/video.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()
router.use(verifyJWT);

router.route("/publish").post(upload.fields([
    {
        name:"video",
        maxCount:1
    },
    {
        name:"thumbnail",
        maxCount:1
    }
]),publishAVideo)

router.route("/:videoId")
.patch(upload.single("thumbnail"),updateVideo)
.delete(deleteVideo)

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
export default router