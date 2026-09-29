import { dbService } from '../services/dbService.js';
import { analyzeContentWithGemini } from '../services/geminiService.js';
import { analyzeScanSchema } from '../validators/scanValidator.js';

export const scanController = {
  async analyze(req, res, next) {
    try {
      const validated = analyzeScanSchema.parse(req.body);
      const userId = req.user.id;

      // 1. Run AI / Security Analysis
      const analysis = await analyzeContentWithGemini(validated.content, validated.inputType);

      // 2. Persist in database under authenticated user's ID
      const savedScan = await dbService.createScan({
        userId,
        inputType: validated.inputType,
        inputContent: validated.content,
        analysis
      });

      // 3. Log security event for audit trail
      await dbService.logSecurityEvent({
        userId,
        eventType: 'SCAN_CREATED',
        description: `Scanned ${validated.inputType} content (Threat Level: ${analysis.threatLevel}, Risk: ${analysis.riskScore}/100)`,
        metadata: { scanId: savedScan.id, threatLevel: analysis.threatLevel }
      });

      // If high risk or privacy threat, log special alert event
      if (analysis.threatLevel === 'HIGH' || analysis.threatLevel === 'CRITICAL') {
        await dbService.logSecurityEvent({
          userId,
          eventType: 'HIGH_RISK_DETECTED',
          description: `Critical threat detected: ${analysis.summary}`,
          metadata: { scanId: savedScan.id, riskScore: analysis.riskScore }
        });
      }

      if (analysis.privacyFindings && analysis.privacyFindings.length > 0) {
        await dbService.logSecurityEvent({
          userId,
          eventType: 'PRIVACY_RISK_DETECTED',
          description: `Privacy leak alert: Found ${analysis.privacyFindings.length} PII exposure indicators`,
          metadata: { scanId: savedScan.id }
        });
      }

      res.status(201).json({
        success: true,
        data: savedScan
      });
    } catch (err) {
      next(err);
    }
  },

  async getScans(req, res, next) {
    try {
      const userId = req.user.id;
      const { filter, search } = req.query;

      const scans = await dbService.getScansByUserId(userId, { filter, search });

      res.status(200).json({
        success: true,
        count: scans.length,
        data: scans
      });
    } catch (err) {
      next(err);
    }
  },

  async getScanById(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const scan = await dbService.getScanByIdAndUserId(id, userId);

      if (!scan) {
        return res.status(404).json({
          success: false,
          error: 'Scan record not found or access denied.'
        });
      }

      res.status(200).json({
        success: true,
        data: scan
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteScan(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const deleted = await dbService.deleteScan(id, userId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Scan record not found or access denied.'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Scan analysis deleted successfully.'
      });
    } catch (err) {
      next(err);
    }
  }
};
