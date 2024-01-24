import { Router } from "express";
import { validateLoginAuthValues, validateRegisterAuthValues } from "../middleware/validationMiddleware.js";
import { loginUser, registerUser, updateUserDetails, updatingPassword } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateRegisterAuthValues, registerUser)
router.route('/login').post(validateLoginAuthValues ,loginUser)
router.route('/user/:token').put(updateUserDetails)
router.route('/user/changePassword/:token').put(updatingPassword)

export default router