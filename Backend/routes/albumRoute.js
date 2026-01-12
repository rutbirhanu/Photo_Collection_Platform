// src/routes/upload.routes.js
const express = require("express");
// const upload = require("../middleware/upload.js");
// const {uploadPhotoToAlbum} = require("../controllers/uploadController.js");
const verifyToken = require("../middleware/auth.js");
const { createAlbum, getMyAlbums, getAlbumById, updateAlbum, deleteAlbum } = require("../controllers/albumController.js");

const router = express.Router();

router.post("/", verifyToken, createAlbum);
router.get("/", verifyToken, getMyAlbums);
router.get("/:id", verifyToken, getAlbumById);
router.put("/:id", verifyToken, updateAlbum);
router.delete("/:id", verifyToken, deleteAlbum);

// PUBLIC (QR)
router.get("/public/:token", getAlbumByPublicToken);

module.exports = router;


// router.post("/:publicToken", upload.single("photo"), uploadPhotoToAlbum);
