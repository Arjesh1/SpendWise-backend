import { Router } from "express";
import { validateAuthValues } from "../middleware/validationMiddleware.js";
import { loginUser, registerUser } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateAuthValues, registerUser)
router.route('/login').get(loginUser)

export default router