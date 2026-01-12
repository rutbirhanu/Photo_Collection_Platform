const upload = require("../middleware/upload.js");
const {uploadPhoto} = require("../controllers/uploadController.js");

const router = require("express").Router();
const { register, login, getCurrentUser, logout } = require("../controllers/userController");
const verifyToken = require("../middleware/auth.js");


router.post("/register", register);
router.post("/login", login);
router.get("/fetch-current-user", verifyToken, getCurrentUser)
router.post("/logout", logout)
// router.post("/:slug", upload.single("photo"), uploadPhoto);


module.exports = router;




