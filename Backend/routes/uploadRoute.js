const router = require("express").Router();
const upload = require("../middleware/upload");
const {uploadPhoto} = require("../controllers/uploadController");

// PUBLIC upload via QR
router.post(
  "/:albumId",
 upload.array("photos", 50),
  uploadPhoto
);

module.exports = router;
