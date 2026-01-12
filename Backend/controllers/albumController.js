const prisma = require("../config/dbConfig");
const crypto = require("crypto");


exports.createAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId, uploadLimit, expiresAt } = req.body;

    // Ensure event belongs to user
    const event = await prisma.event.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const album = await prisma.album.create({
      data: {
        eventId,
        publicToken: crypto.randomUUID(),
        uploadLimit,
        expiresAt,
      },
    });

    res.status(201).json(album);
  } catch (error) {
    console.error("Create album error:", error);
    res.status(500).json({ message: "Failed to create album" });
  }
};


exports.getMyAlbums = async (req, res) => {
  try {
    const userId = req.user.id;

    const albums = await prisma.album.findMany({
      where: {
        event: { userId },
      },
      include: {
        event: true,
        _count: {
          select: { photos: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(albums);
  } catch (error) {
    console.error("Fetch albums error:", error);
    res.status(500).json({ message: "Failed to fetch albums" });
  }
};


exports.getAlbumById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const album = await prisma.album.findFirst({
      where: {
        id,
        event: { userId },
      },
      include: {
        event: true,
        photos: true,
      },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.json(album);
  } catch (error) {
    console.error("Fetch album error:", error);
    res.status(500).json({ message: "Failed to fetch album" });
  }
};



exports.getAlbumByPublicToken = async (req, res) => {
  try {
    const { token } = req.params;

    const album = await prisma.album.findUnique({
      where: { publicToken: token },
      include: {
        event: {
          select: { eventType: true },
        },
        photos: true,
      },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Check expiration
    if (album.expiresAt && album.expiresAt < new Date()) {
      return res.status(403).json({ message: "Album expired" });
    }

    // Check upload limit
    if (album.uploadsUsed >= album.uploadLimit) {
      return res.status(403).json({ message: "Upload limit reached" });
    }

    res.json(album);
  } catch (error) {
    console.error("Public album fetch error:", error);
    res.status(500).json({ message: "Failed to fetch album" });
  }
};


exports.updateAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { uploadLimit, expiresAt } = req.body;

    const album = await prisma.album.findFirst({
      where: {
        id,
        event: { userId },
      },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const updated = await prisma.album.update({
      where: { id },
      data: {
        uploadLimit,
        expiresAt,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update album error:", error);
    res.status(500).json({ message: "Failed to update album" });
  }
};



exports.deleteAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const album = await prisma.album.findFirst({
      where: {
        id,
        event: { userId },
      },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    await prisma.album.delete({ where: { id } });

    res.json({ message: "Album deleted" });
  } catch (error) {
    console.error("Delete album error:", error);
    res.status(500).json({ message: "Failed to delete album" });
  }
};
