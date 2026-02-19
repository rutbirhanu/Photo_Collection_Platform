const { PLANS, getPlanFeatures } = require("../config/plans.js");

// Middleware to check if user has access to a specific feature
const checkFeatureAccess = (feature) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const features = getPlanFeatures(user.plan);

      if (!features[feature]) {
        return res.status(403).json({
          message: `${feature} is not available in your ${user.plan} plan. Please upgrade to access this feature.`
        });
      }

      req.planFeatures = features;
      next();
    } catch (error) {
      console.error("Feature access check error:", error);
      res.status(500).json({ message: "Failed to validate feature access" });
    }
  };
};

// Middleware to check subscription status
const checkSubscriptionStatus = (allowedStatuses = ['ACTIVE']) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!allowedStatuses.includes(user.subscriptionStatus)) {
        return res.status(403).json({
          message: `Your subscription is ${user.subscriptionStatus}. Please update your payment method to continue using premium features.`
        });
      }

      next();
    } catch (error) {
      console.error("Subscription status check error:", error);
      res.status(500).json({ message: "Failed to validate subscription status" });
    }
  };
};

// Middleware to enforce plan limits for specific actions
const enforcePlanLimit = (limitType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const features = getPlanFeatures(user.plan);

      switch (limitType) {
        case 'MAX_EVENTS':
          // This is handled in event controller with database count
          next();
          break;

        case 'MAX_PHOTOS_PER_EVENT':
          // This is handled in photo controller with album upload count
          next();
          break;

        case 'MAX_ALBUMS_PER_EVENT':
          // TODO: Implement when multiple albums per event is supported
          next();
          break;

        default:
          next();
      }
    } catch (error) {
      console.error("Plan limit enforcement error:", error);
      res.status(500).json({ message: "Failed to enforce plan limits" });
    }
  };
};

// Middleware to add plan information to request
const addPlanInfo = async (req, res, next) => {
  try {
    const user = req.user;
    const features = getPlanFeatures(user.plan);
    
    req.planInfo = {
      plan: user.plan,
      features,
      subscriptionStatus: user.subscriptionStatus
    };
    
    next();
  } catch (error) {
    console.error("Add plan info error:", error);
    res.status(500).json({ message: "Failed to add plan information" });
  }
};

module.exports = {
  checkFeatureAccess,
  checkSubscriptionStatus,
  enforcePlanLimit,
  addPlanInfo
};
