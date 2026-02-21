const prisma = require("../config/dbConfig.js");

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with their events, albums, and photos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        events: {
          include: {
            albums: {
              include: {
                _count: {
                  select: {
                    photos: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate stats
    const totalEvents = user.events.length;

    const totalAlbums = user.events.reduce(
      (sum, event) => sum + event.albums.length,
      0
    );

    const totalPhotos = user.events.reduce(
      (sum, event) =>
        sum +
        event.albums.reduce(
          (albumSum, album) => albumSum + album._count.photos,
          0
        ),
      0
    );

    // Get upload limit based on user's plan
    const { getUploadLimit } = require("../config/plans.js");
    const uploadLimit = getUploadLimit(user.plan);

    // Calculate uploads used
    const uploadsUsed = user.events.reduce(
      (sum, event) =>
        sum +
        event.albums.reduce(
          (albumSum, album) => albumSum + (album.uploadsUsed || 0),
          0
        ),
      0
    );

    res.json({
      totalEvents,
      totalAlbums,
      totalPhotos,
      uploadsUsed,
      uploadLimit,
      plan: user.plan
    });

  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};