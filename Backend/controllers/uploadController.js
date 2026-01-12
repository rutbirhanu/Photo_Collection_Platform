const prisma = require("../config/dbConfig.js");
const cloudinary = require("../config/cloudinaryConfig.js");

exports.uploadPhoto = async (req, res) => {
  try {
    const { publicToken } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 1️⃣ Find album via public token
    const album = await prisma.album.findUnique({
      where: { publicToken },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // 2️⃣ Check expiration
    if (album.expiresAt && album.expiresAt < new Date()) {
      return res.status(403).json({ message: "Album expired" });
    }

    // 3️⃣ Check upload limit
    if (album.uploadsUsed >= album.uploadLimit) {
      return res.status(403).json({ message: "Upload limit reached" });
    }

    // 4️⃣ Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `albums/${album.id}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    // 5️⃣ Save photo record
    const photo = await prisma.photo.create({
      data: {
        albumId: album.id,
        cloudinaryId: uploadResult.public_id,
        secureUrl: uploadResult.secure_url,
      },
    });

    // 6️⃣ Increment uploadsUsed (atomic)
    await prisma.album.update({
      where: { id: album.id },
      data: {
        uploadsUsed: { increment: 1 },
      },
    });

    res.status(201).json(photo);
  } catch (error) {
    console.error("Upload photo error:", error);
    res.status(500).json({ message: "Failed to upload photo" });
  }
};