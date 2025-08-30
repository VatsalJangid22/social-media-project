import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.route("/send/:id").post(isAuthenticated,sendMessage);
messageRouter.route("/all/:id").get(isAuthenticated,getMessage);

export default messageRouter;