import { Router } from "express";
import { validateAuthValues } from "../middleware/validationMiddleware.js";
import { loginUser, registerUser, updateUserDetails } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateAuthValues, registerUser)
router.route('/login').post(loginUser)
router.route('/user/:token').put(updateUserDetails)

export default router