import prisma from "../config/db.js";
import QRCode from "qrcode";
import crypto from "crypto";
import { PLANS } from "../config/plans.js";

export const createEvent = async (req, res) => {
  try {
    const user = req.user;
    const { eventType } = req.body;

    // 1️⃣ Payment gate
    if (!user.isPaid) {
      return res.status(403).json({ message: "Payment required" });
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

    // 4️⃣ Determine upload limit from plan
    const uploadLimit = PLANS[user.plan].uploadLimit;

    // 5️⃣ Create Album
    const album = await prisma.album.create({
      data: {
        eventId: event.id,
        publicToken,
        uploadLimit,
      },
    });

    // 6️⃣ Generate QR for album
    const uploadUrl = `${process.env.FRONTEND_URL}/upload/${publicToken}`;
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
