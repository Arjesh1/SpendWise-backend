import { Router } from "express";
import { validateChangePasswordValues, validateLoginAuthValues, validateRegisterAuthValues, validateResetPassword, validateUpdateAuthValues } from "../middleware/validationMiddleware.js";
import { changePassword, loginUser, registerUser, resetPassword, updateUserDetails } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateRegisterAuthValues, registerUser)
router.route('/login').post(validateLoginAuthValues ,loginUser)
router.route('/user').put(validateUpdateAuthValues, updateUserDetails)
router.route('/user/changePassword').put(validateChangePasswordValues, changePassword)
router.route('/resetPassword').post(validateResetPassword, resetPassword)

export default router