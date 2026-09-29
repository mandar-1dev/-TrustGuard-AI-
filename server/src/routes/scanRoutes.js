import { Router } from 'express';
import { scanController } from '../controllers/scanController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { scanRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All scan routes require user authentication
router.use(requireAuth);

router.post('/analyze', scanRateLimiter, scanController.analyze);
router.get('/', scanController.getScans);
router.get('/:id', scanController.getScanById);
router.delete('/:id', scanController.deleteScan);

export default router;
