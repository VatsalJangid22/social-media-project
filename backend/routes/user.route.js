import express from "express";
import { editProfile, followOrUnfollow, getProfile, login, logout, register, searchUsersByUsername } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js"

const userRouter = express.Router();

userRouter.route("/register").post(register);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logout);
userRouter.route("/:id/profile").get(isAuthenticated, getProfile);
userRouter.route("/profile/edit").post(isAuthenticated, upload.single("profilePicture"), editProfile);
userRouter.route("/followorunfollow/:id").post(isAuthenticated, followOrUnfollow);
userRouter.route("/search").get(isAuthenticated, searchUsersByUsername);

export default userRouter;