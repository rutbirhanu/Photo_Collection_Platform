const prisma = require("../config/dbConfig.js");
const QRCode = require("qrcode");
const crypto = require("crypto");
const { PLANS, canCreateEvent, getUploadLimit } = require("../config/plans.js");

exports.createEvent = async (req, res) => {
  try {
    const user = req.user;
    const { eventType } = req.body;

    // 1️⃣ Check if user can create more events based on plan
    const currentEventCount = await prisma.event.count({
      where: { userId: user.id }
    });

    if (!canCreateEvent(user, currentEventCount)) {
      const planLimits = PLANS[user.plan].features;
      return res.status(403).json({
        message: `Event limit reached. Your ${user.plan} plan allows ${planLimits.maxEvents === -1 ? 'unlimited' : planLimits.maxEvents} events.`
      });
    }

    // 2️⃣ Create Event
    const event = await prisma.event.create({
      data: {
        eventType,
        userId: user.id,
      },
    });

    // 3️⃣ Generate album public token
    const publicToken = crypto.randomUUID();

    // 4️⃣ Get upload limit from user's plan
    const uploadLimit = getUploadLimit(user.plan);

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
      planLimits: PLANS[user.plan].features
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
