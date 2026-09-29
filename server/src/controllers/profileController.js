import { dbService } from '../services/dbService.js';
import { updateProfileSchema } from '../validators/authValidator.js';

export const profileController = {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await dbService.findUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found.'
        });
      }

      const scans = await dbService.getScansByUserId(userId);
      const events = await dbService.getSecurityEvents(userId, 10);

      let totalThreats = 0;
      let totalPrivacyRisks = 0;

      for (const s of scans) {
        totalThreats += (s.threats || []).length;
        totalPrivacyRisks += (s.privacy_findings || []).length;
      }

      res.status(200).json({
        success: true,
        data: {
          user,
          securitySummary: {
            totalScans: scans.length,
            threatsDetected: totalThreats,
            privacyFindings: totalPrivacyRisks
          },
          recentSecurityEvents: events
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const validated = updateProfileSchema.parse(req.body);

      const updatedUser = await dbService.updateUserProfile(userId, validated);

      await dbService.logSecurityEvent({
        userId,
        eventType: 'PROFILE_UPDATED',
        description: 'User updated profile details'
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: updatedUser
      });
    } catch (err) {
      next(err);
    }
  }
};
