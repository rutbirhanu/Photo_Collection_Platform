// src/routes/upload.routes.js
import express from "express";
import upload from "../middleware/upload.js";
import { uploadPhotoToAlbum } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/:publicToken", upload.single("photo"), uploadPhotoToAlbum);

export default router;
