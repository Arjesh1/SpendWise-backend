import { Router } from "express";
import { validateAuthValues } from "../middleware/validationMiddleware.js";
import { loginUser, registerUser, updateUserDetails, updatingPassword } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateAuthValues, registerUser)
router.route('/login').post(loginUser)
router.route('/user/:token').put(updateUserDetails)
router.route('/user/changePassword/:token').put(updatingPassword)

export default router