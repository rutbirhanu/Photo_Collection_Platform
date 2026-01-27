const prisma = require("../config/dbConfig.js");
const QRCode = require("qrcode");
const crypto = require("crypto");
const PLANS = {
  FREE: { price: 0, guests: 20, photos: 100 },
  BASIC: { price: 2000, guests: 100, photos: 1000 },
  PRO: { price: 5000, guests: 500, photos: 10000 }
};

exports.createEvent = async (req, res) => {
  try {
    const user = req.user;
    const { eventType } = req.body;
    console.log(user)

    // 1️⃣ Payment gate
    // if (!user.isPaid) {
    //   return res.status(403).json({ message: "Payment required" });
    // }

    // 2️⃣ Create Event
    const event = await prisma.event.create({
      data: {
        eventType,
        userId: user.id,
      },
    });

    // 3️⃣ Generate album public token
    const publicToken = crypto.randomUUID();

    // 4️⃣ Determine upload limit from plan
    console.log("User Plan:", user.plan);
    const uploadLimit = 10;

    // 5️⃣ Create Album
    const album = await prisma.album.create({
      data: {
        eventId: event.id,
        publicToken,
        uploadLimit,
      },
    });

    // 6️⃣ Generate QR for album
    const uploadUrl = `${process.env.FRONTEND_URL}/upload/${album.id}`;
    const qrCodeBase64 = await QRCode.toDataURL(uploadUrl);

    // 7️⃣ Return everything frontend needs
    res.status(201).json({
      event,
      album,
      qrCode: qrCodeBase64,
      uploadUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        albums: true,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("Retrieved Events:", events);
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};


exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        userId,
      },
      include: {
        album: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { eventType } = req.body;

    // Ensure ownership
    const event = await prisma.event.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        eventType,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update event" });
  }
};


exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Ensure ownership
    const event = await prisma.event.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete related albums
    await prisma.album.deleteMany({
      where: { eventId },
    });

    // Delete event
    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};
