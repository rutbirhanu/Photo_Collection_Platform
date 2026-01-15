const router = require("express").Router();
const upload = require("../middleware/upload");
const {uploadPhoto} = require("../controllers/uploadController");

// PUBLIC upload via QR
router.post(
  "/:publicToken",
  upload.single("photo"),
  uploadPhoto
);

module.exports = router;
