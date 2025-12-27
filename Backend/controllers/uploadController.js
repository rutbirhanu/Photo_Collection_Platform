import QRCode from "qrcode";
import slugify from "slugify";

export const createEvent = async (req, res) => {
  const user = req.user;

  if (!user.isActive) {
    return res.status(403).json({ message: "Payment required" });
  }

  const slug = slugify(req.body.title + Date.now());
  const uploadUrl = `${process.env.FRONTEND_URL}/upload/${slug}`;
  const qrCode = await QRCode.toDataURL(uploadUrl);

  const event = await prisma.event.create({
    data: {
      title: req.body.title,
      slug,
      qrCodeUrl: qrCode,
      userId: user.id,
      guestLimit: user.maxGuests,
      photoLimit: user.maxPhotos,
    },
  });

  res.json(event);
};
