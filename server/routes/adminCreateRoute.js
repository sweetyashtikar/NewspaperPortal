import express from "express"
import multer from "multer";
import {createAdmin} from '../controllers/adminCreateController.js'

const router = express.Router();


// In-memory storage for image
const storage = multer.memoryStorage();
const upload = multer({ storage }); // Export so you can use it in routes
// router.post(
//     '/create-admin',
//     protect,
//     authorizeRoles('superadmin'),
//     upload.single('logo'), // middleware to accept file
//     createAdmin
//   );


router.post("/create-admin", upload.single('logo'), createAdmin)

export default router;
  