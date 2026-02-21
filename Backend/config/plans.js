const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    stripePriceId: null, // No stripe price for free plan
    features: {
      maxEvents: 3,
      maxPhotosPerEvent: 50,
      maxAlbumsPerEvent: 1,
      maxUploadSizeMB: 5,
      qrCodeExpiryDays: 7,
      downloadEnabled: true,
      bulkDownloadEnabled: false,
      customBranding: false,
      prioritySupport: false,
    }
  },
  PRO: {
    name: 'Pro',
    price: 999, // $9.99 in cents
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
    features: {
      maxEvents: 20,
      maxPhotosPerEvent: 500,
      maxAlbumsPerEvent: 3,
      maxUploadSizeMB: 10,
      qrCodeExpiryDays: 30,
      downloadEnabled: true,
      bulkDownloadEnabled: true,
      customBranding: false,
      prioritySupport: true,
    }
  },
  PREMIUM: {
    name: 'Premium',
    price: 2999, // $29.99 in cents
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_placeholder',
    features: {
      maxEvents: -1, // Unlimited
      maxPhotosPerEvent: -1, // Unlimited
      maxAlbumsPerEvent: -1, // Unlimited
      maxUploadSizeMB: 25,
      qrCodeExpiryDays: -1, // Never expires
      downloadEnabled: true,
      bulkDownloadEnabled: true,
      customBranding: true,
      prioritySupport: true,
    }
  }
};

// Helper functions to check plan limits
const canCreateEvent = (user, currentEventCount) => {
  const plan = PLANS[user.plan];
  return plan.features.maxEvents === -1 || currentEventCount < plan.features.maxEvents;
};

const canUploadPhotos = (album, photoCount) => {
  // Get the user plan through the album
  const userPlan = album?.event?.user?.plan || 'FREE';
  const plan = PLANS[userPlan];
  return plan.features.maxPhotosPerEvent === -1 ||
    (album.uploadsUsed + photoCount) <= plan.features.maxPhotosPerEvent;
};

const getUploadLimit = (userPlan) => {
  const plan = PLANS[userPlan];
  return plan.features.maxPhotosPerEvent;
};

const getMaxFileSize = (userPlan) => {
  const plan = PLANS[userPlan];
  return plan.features.maxUploadSizeMB * 1024 * 1024; // Convert to bytes
};

const getPlanFeatures = (userPlan) => {
  return PLANS[userPlan]?.features || PLANS.FREE.features;
};

module.exports = {
  PLANS,
  canCreateEvent,
  canUploadPhotos,
  getUploadLimit,
  getMaxFileSize,
  getPlanFeatures
};
