const prisma = require("../config/dbConfig.js");
const cloudinary = require("../config/cloudinaryConfig.js");


exports.uploadPhoto = async (req, res) => {
  try {
    const { albumId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // 1️⃣ Find album
    const album = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // 2️⃣ Expiration check
    if (album.expiresAt && album.expiresAt < new Date()) {
      return res.status(403).json({ message: "Album expired" });
    }

    // 3️⃣ Upload limit check (optional)
    if (
      album.uploadLimit !== null &&
      album.uploadsUsed + req.files.length > album.uploadLimit
    ) {
      return res.status(403).json({ message: "Upload limit exceeded" });
    }

    // 4️⃣ Upload ALL images
    const uploadedPhotos = [];

    for (const file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `albums/${albumId}`,
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(file.buffer);
      });

      const photo = await prisma.photo.create({
        data: {
          albumId: albumId,
          cloudinaryId: uploadResult.public_id,
          secureUrl: uploadResult.secure_url,
        },
      });

      uploadedPhotos.push(photo);
    }

    // 5️⃣ Increment uploadsUsed by COUNT
    await prisma.album.update({
      where: { id: albumId },
      data: {
        uploadsUsed: { increment: req.files.length },
      },
    });
    console.log("Uploaded photos:", uploadedPhotos);
    res.status(201).json(uploadedPhotos);
  } catch (error) {
    console.error("Upload photos error:", error);
    res.status(500).json({ message: "Failed to upload photos" });
  }
};



exports.getAlbumPhotos = async (req, res) => {
  try {

    const { albumId } = req.params;
    const photos = await prisma.photo.findMany({
      where: { albumId },
      orderBy: { uploadedAt: "desc" },
    });

    console.log("Fetched photos:", photos);
    res.json(photos);
  }
  catch (error) {
    console.error("fetch photos error:", error);
    res.status(500).json({ message: "Failed to fetch photos" });
  }
};
