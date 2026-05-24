import { Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment } from "../controllers/comment.controller.js";


const router=Router();

router.use(verifyJWT);
router.route("/comment").post(addComment)

export default router