import express from 'express';
import { protect } from '../../middleware/auth.js';
import {authorizeAdmin} from "../../middleware/superAdmin.js"
import {loginAdmin, updateAdminPassword} from "../../controllers/Admins/adminController.js"
import {updateEmployeeStatus} from "../../controllers/Admins/allEmployeeAccess.js"

const router = express.Router();


router.post('/login', loginAdmin);
router.post('/update-password',protect,authorizeAdmin, updateAdminPassword)

router.put('/update-status', protect, authorizeAdmin,updateEmployeeStatus); // or remove protect if it's public
export default router;