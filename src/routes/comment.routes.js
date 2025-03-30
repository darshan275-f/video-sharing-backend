import { Router } from "express";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
const commentRouter=Router();

commentRouter.route("/addComment/:videoID").post(verifyJwt,addComment);
commentRouter.route("/updateComment/:commentId").patch(verifyJwt,updateComment);
commentRouter.route("/deleteComment/:commentId").post(verifyJwt,deleteComment);

export default commentRouter;