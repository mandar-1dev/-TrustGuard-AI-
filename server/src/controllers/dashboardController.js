import { dbService } from '../services/dbService.js';

export const dashboardController = {
  async getStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await dbService.getDashboardStats(userId);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  },

  async getActivity(req, res, next) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit || '10', 10);

      const [recentScans, securityEvents] = await Promise.all([
        dbService.getScansByUserId(userId),
        dbService.getSecurityEvents(userId, limit)
      ]);

      res.status(200).json({
        success: true,
        data: {
          recentScans: recentScans.slice(0, limit),
          securityEvents
        }
      });
    } catch (err) {
      next(err);
    }
  }
};
