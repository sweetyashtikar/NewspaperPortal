import express from "express"
import {protect} from "../../middleware/auth.js";
import {authorizeEmployee} from "../../middleware/superAdmin.js";
import {createArticle} from "../../controllers/Employee/Article.js"

const router = express.Router();

router.post('/createArticle', protect, authorizeEmployee,createArticle)


export default router;
