// src/routes/upload.routes.js
const express = require("express");
const upload = require("../middleware/upload.js");
const {uploadPhotoToAlbum} = require("../controllers/uploadController.js");

const router = express.Router();

router.post("/:publicToken", upload.single("photo"), uploadPhotoToAlbum);

module.exports = router;

