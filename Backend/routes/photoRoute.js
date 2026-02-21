const router = require("express").Router();
const upload = require("../middleware/upload");
const { uploadPhoto, getAlbumPhotos, deletePhoto } = require("../controllers/photoController");
const verifyToken = require("../middleware/auth");

// PUBLIC upload via QR
router.post(
  "/:albumId",
  upload.array("photos", 50),
  uploadPhoto
);

router.get("/:albumId", getAlbumPhotos)

// DELETE photo (protected)
router.delete("/:photoId", verifyToken, deletePhoto);

module.exports = router;
