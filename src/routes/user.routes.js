import { Router } from "express";
import { changeAvatar, changeCoverImage, changeInfo, changePassword, loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../Middlewares/auth.middleware.js";

const router =Router();

router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1
    }
]),registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt,logOutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/changePassword").post(verifyJwt,changePassword);

router.route("/changeAvatar").patch(verifyJwt,upload.single("avatar"),changeAvatar);

router.route("/changeCoverImage").patch(verifyJwt,upload.single("coverImage"),changeCoverImage);

router.route("/changeInfo").patch(verifyJwt,changeInfo);

export default router;

