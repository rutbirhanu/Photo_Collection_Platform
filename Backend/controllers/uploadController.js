// src/controllers/upload.controller.js
import prisma from "../config/db.js";

export const uploadPhotoToAlbum = async (req, res) => {
  try {
    const { publicToken } = req.params;

    // 1️⃣ Find album
    const album = await prisma.album.findUnique({
      where: { publicToken },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // 2️⃣ Enforce upload limit
    if (album.uploadsUsed >= album.uploadLimit) {
      return res.status(403).json({
        message: "Upload limit reached for this album",
      });
    }

    // 3️⃣ File check
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // 4️⃣ Save photo record
    await prisma.photo.create({
      data: {
        albumId: album.id,
        cloudinaryId: req.file.filename,
        secureUrl: req.file.path,
      },
    });

    // 5️⃣ Increment counter (atomic)
    await prisma.album.update({
      where: { id: album.id },
      data: {
        uploadsUsed: { increment: 1 },
      },
    });

    res.json({
      success: true,
      message: "Photo uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
