import { Router } from "express";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller.js";
const Commentrouter=Router();

Commentrouter.route("/addComment/:videoID").post(verifyJwt,addComment);
Commentrouter.route("/updateComment/:commentId").patch(verifyJwt,updateComment);
Commentrouter.route("/deleteComment/:commentId").post(verifyJwt,deleteComment);

export default Commentrouter;