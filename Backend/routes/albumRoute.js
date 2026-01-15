// src/routes/upload.routes.js
const express = require("express");
const verifyToken = require("../middleware/auth.js");
const { createAlbum, getMyAlbums, getAlbumById, updateAlbum, deleteAlbum, getAlbumByPublicToken } = require("../controllers/albumController.js");

const router = express.Router();

router.post("/", verifyToken, createAlbum);
router.get("/", verifyToken, getMyAlbums);
router.get("/:id", verifyToken, getAlbumById);
router.put("/:id", verifyToken, updateAlbum);
router.delete("/:id", verifyToken, deleteAlbum);

// PUBLIC (QR)
router.get("/public/:token", getAlbumByPublicToken);

module.exports = router;


