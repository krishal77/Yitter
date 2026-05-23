import {Router} from "express"
import{createTweet,
    updatedTweet,
    deleteTweet} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router= Router();

router.use(verifyJWT);
router.route("/tweet").post(createTweet)

router.route("/:tweetId")
.patch(updatedTweet)
.delete(deleteTweet)

export default router