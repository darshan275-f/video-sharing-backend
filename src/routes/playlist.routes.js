import { Router } from "express";
import {verifyJwt} from '../Middlewares/auth.middleware.js'
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
const playlistRouter=Router();

playlistRouter.route("/createPlaylist").post(verifyJwt,createPlaylist);

playlistRouter.route("/getUserPlaylists/:userId").get(getUserPlaylists);

playlistRouter.route("/getPlaylistById/:playlistId").get(getPlaylistById);

playlistRouter.route("/addVideoToPlaylist/:playlistId/:videoId").post(verifyJwt,addVideoToPlaylist);

playlistRouter.route("/removeVideoFromPlaylist/:playlistId/:videoId").post(verifyJwt,removeVideoFromPlaylist);

playlistRouter.route("/deletePlaylist/:playlistId").post(verifyJwt,deletePlaylist);

playlistRouter.route("/updatePlaylist/:playlistId").patch(verifyJwt,updatePlaylist);
export default playlistRouter;