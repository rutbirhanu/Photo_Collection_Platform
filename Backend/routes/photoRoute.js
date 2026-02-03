const router = require("express").Router();
const upload = require("../middleware/upload");
const { uploadPhoto, getAlbumPhotos } = require("../controllers/photoController");

// PUBLIC upload via QR
router.post(
  "/:albumId",
  upload.array("photos", 50),
  uploadPhoto
);

router.get("/:albumId", getAlbumPhotos)

module.exports = router;
