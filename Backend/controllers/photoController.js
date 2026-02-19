const prisma = require("../config/dbConfig.js");
const cloudinary = require("../config/cloudinaryConfig.js");
const { canUploadPhotos, getMaxFileSize } = require("../config/plans.js");


exports.uploadPhoto = async (req, res) => {
  try {
    const { albumId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // 1️⃣ Find album with user information
    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        event: {
          include: {
            user: true
          }
        }
      }
    });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    const user = album.event.user;

    // 2️⃣ Expiration check
    if (album.expiresAt && album.expiresAt < new Date()) {
      return res.status(403).json({ message: "Album expired" });
    }

    // 3️⃣ Check file sizes against plan limits
    const maxFileSize = getMaxFileSize(user.plan);
    for (const file of req.files) {
      if (file.size > maxFileSize) {
        return res.status(400).json({
          message: `File size exceeds limit. Max size: ${maxFileSize / (1024 * 1024)}MB`
        });
      }
    }

    // 4️⃣ Upload limit check based on user's plan
    if (!canUploadPhotos(album, req.files.length)) {
      return res.status(403).json({
        message: "Upload limit exceeded for this event"
      });
    }

    // 5️⃣ Upload ALL images
    const uploadedPhotos = [];

    for (const file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `albums/${albumId}`,
              resource_type: "image",
              max_file_size: maxFileSize,
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

    // 6️⃣ Increment uploadsUsed by COUNT
    await prisma.album.update({
      where: { id: albumId },
      data: {
        uploadsUsed: { increment: req.files.length },
      },
    });

    console.log("Uploaded photos:", uploadedPhotos);
    res.status(201).json({
      photos: uploadedPhotos,
      remainingUploads: album.uploadLimit - album.uploadsUsed - req.files.length
    });
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
