const router = require("express").Router()
const {createEvent, getMyEvents, getEventById, updateEvent, deleteEvent} = require("../controllers/eventController.js") 
const verifyToken = require("../middleware/auth.js")


router.post("/create-event", verifyToken, createEvent)
router.get("/", verifyToken, getMyEvents);
router.get(":eventId", verifyToken, getEventById);
router.put(":eventId", verifyToken, updateEvent);
router.delete(":eventId", verifyToken, deleteEvent);


module.exports = router



