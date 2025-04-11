import express from 'express';
import { registerSuperAdmin, superAdminLogin } from '../../controllers/SuperAdmin/superAdminController.js';

const router = express.Router();

router.post('/register', registerSuperAdmin); // Only for first-time setup
router.post('/login', superAdminLogin);

export default router;