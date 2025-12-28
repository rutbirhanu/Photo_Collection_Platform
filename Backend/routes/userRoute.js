import upload from "../middleware/upload.js";
import { uploadPhoto } from "../controllers/upload.controller.js";

const router = require("express").Router();
const { register, login } = require("../controllers/auth.controller");


router.post("/register", register);
router.post("/login", login);
router.post("/:slug", upload.single("photo"), uploadPhoto);


module.exports = router;




