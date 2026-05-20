import express from "express";
import { login, logout, register, updateProfile, googleAuth, updateProfilePhoto } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);
router.route("/profile/photo/update").post(isAuthenticated,singleUpload,updateProfilePhoto);
router.route("/google").post(googleAuth);

export default router;
