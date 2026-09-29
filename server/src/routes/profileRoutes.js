import { Router } from 'express';
import { profileController } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

export default router;
