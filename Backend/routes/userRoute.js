const upload = require("../middleware/upload.js");
const {uploadPhoto} = require("../controllers/uploadController.js");

const router = require("express").Router();
const { register, login } = require("../controllers/userController");


router.post("/register", register);
router.post("/login", login);
// router.post("/:slug", upload.single("photo"), uploadPhoto);


module.exports = router;




