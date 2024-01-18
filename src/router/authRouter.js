import { Router } from "express";
import { validateAuthValues } from "../middleware/validationMiddleware.js";
import { registerUser } from "../controllers/authController.js";
const router = Router()

router.route('/').post(validateAuthValues, registerUser)

export default router