import express from "express"
import multer from "multer";
import {createAdmin,getAllAdmins} from '../../controllers/SuperAdmin/adminCreateController.js'

import {protect} from "../../middleware/auth.js";
import {authorizeSuperAdmin} from "../../middleware/superAdmin.js"
const router = express.Router();


// In-memory storage for image
const storage = multer.memoryStorage();
const upload = multer({ storage }); // Export so you can use it in routes
router.post(
    '/create-admin',
    protect,
    authorizeSuperAdmin,
    upload.single('logo'), // middleware to accept file
    createAdmin
  );


// router.post("/create-admin", upload.single('logo'), createAdmin) //super admin creates the admin
router.get('/getAllAdmins',getAllAdmins)

export default router;
  