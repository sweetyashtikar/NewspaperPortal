import express from "express"

import {registerEmployee,loginemployee,getAllEmployee} from "../../controllers/Employee/EmployeeController.js"

const router = express.Router();

router.post('/register', registerEmployee)
router.post('/login', loginemployee)
router.get('/getAllEmployee', getAllEmployee)

export default router;
