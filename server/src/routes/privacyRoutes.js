import { Router } from 'express';
import { privacyController } from '../controllers/privacyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Redaction endpoint can be used with authentication
router.post('/redact', requireAuth, privacyController.redact);

export default router;
