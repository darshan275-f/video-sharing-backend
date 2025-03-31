import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js"



const createPlaylist = asynchandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError("Login or signin first", 400);
    }
    const { name, description } = req.body
    if (!name) {
        throw new ApiError("all fields are required!!", 400);
    }
    let playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })
    if (!playlist) {
        throw new ApiError("Something went bad while creating playlist", 500);
    }
    return res.status(200).json(
        new ApiResponse(200, "Playlist Created successfully", playlist)
    )


})

const getUserPlaylists = asynchandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    const playlists = await Playlist.find({ owner: userId });

    if (!playlists.length) {
        throw new ApiError("No playlists found for this user", 400);
    }
    return res.status(200).json(
        new ApiResponse(200, "PlayList fetched successfully", playlists)
    )

})

const getPlaylistById = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("There is no Such PlayList", 400);
    }
    return res.status(200).json(
        new ApiResponse(200, "PlayList fetched successfully", playlist)
    )
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!req.user) {
        throw new ApiError("Login or signin first", 400);
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("There is no Such PlayList", 400);
    }
    if (!req.user._id.equals(playlist.owner)) {
        throw new ApiError("You are not owner of this playlist", 400);
    }

    const video = await Video.findById(videoId);
  
    if (!video) {
        throw new ApiError("this is no such video", 400);
    }
    const videoExists = playlist.videos.includes(videoId);
    if (videoExists) {
        throw new ApiError("Video already in the playlist", 400);
    }

    const result = await Playlist.updateOne(
        { _id: playlistId }, // Find the playlist
        { $addToSet: { videos: videoId } } // Add videoId to the videos array (without duplicates)
    );

    if (!result) {
        throw new ApiError("Error while adding video to playlist")
    }

    return res.status(200).json(new ApiResponse(200, "Video added to playlist successfully", result))


})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist
    if (!req.user) {
        throw new ApiError("Login or signin first", 400);
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError("There is no Such PlayList", 400);
    }
    if (!req.user._id.equals(playlist.owner)) {
        throw new ApiError("You are not owner of this playlist", 400);
    }
    const video = await Playlist.findOne({ _id: playlistId, videos: { $in: [videoId] } });
    if (!video) {
        throw new ApiError("this is no such video", 400);
    }
    const result = await Playlist.updateOne({
        _id: playlistId
    },
        {
            $pull: {
                videos: videoId
            }
        })
    return res.status(200).json(new ApiResponse(200, "Deleted SuccessFully", result))

})

const deletePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!req.user) {
        throw new ApiError("Login or signin first", 400);
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    if (!playlist) {
        throw new ApiError("There is no Suc PlayList", 400);
    }
    if (!req.user._id.equals(playlist.owner)) {
        throw new ApiError("You are not owner of this playlist", 400);
    }
    return res.status(200).json(
        new ApiResponse(200, "Playliost deleted Successfully", null)
    )
})

const updatePlaylist = asynchandler(async (req, res) => {
    const { playlistId } = req.params
    if (!req.user) {
        throw new ApiError("Login or signin first", 400);
    }
    const { name, description } = req.body
    if (!name) {
        throw new ApiError("Fields are required", 400);
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name: name,
            description: description
        }
    }, { new: true })
    if (!playlist) {
        throw new ApiError("There is no such PlayList", 400);
    }
    if (!req.user._id.equals(playlist.owner)) {
        throw new ApiError("You are not owner of this playlist", 400);
    }
    return res.status(200).json(
        new ApiResponse(200, "Updated Playlist successfully!!", playlist)
    )
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}