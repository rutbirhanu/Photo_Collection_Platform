const router = require("express").Router()
const {createEvent} = require("../controllers/eventController.js") 
const verifyToken = require("../middleware/auth.js")


router.post("/create-event",verifyToken,createEvent)

module.exports = router



