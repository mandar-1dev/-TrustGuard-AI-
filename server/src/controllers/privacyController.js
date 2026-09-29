import { redactSensitiveContent } from '../services/privacyService.js';
import { redactSchema } from '../validators/scanValidator.js';

export const privacyController = {
  async redact(req, res, next) {
    try {
      const validated = redactSchema.parse(req.body);
      const result = redactSensitiveContent(validated.content);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};
