import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPosts, getCommentsOfPosts, getUserPosts, likePost } from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.route("/addPost").post(isAuthenticated,upload.single("image"),addNewPost);
postRouter.route("/all").get(isAuthenticated,getAllPosts);
postRouter.route("/userpost/all").get(isAuthenticated,getUserPosts);
postRouter.route("/:id/like").get(isAuthenticated,likePost);
postRouter.route("/:id/dislike").get(isAuthenticated,dislikePost);
postRouter.route("/:id/comment").post(isAuthenticated,addComment);
postRouter.route("/:id/comment/all").post(isAuthenticated,getCommentsOfPosts);
postRouter.route("/:id/delete").post(isAuthenticated,deletePost);
postRouter.route("/:id/bookmark").post(isAuthenticated,bookmarkPost);

export default postRouter;