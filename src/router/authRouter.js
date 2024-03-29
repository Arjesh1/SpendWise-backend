import { Router } from "express";
import { validateChangePasswordValues, validateLoginAuthValues, validateNewResetPassword, validateOtp, validateRegisterAuthValues, validateResetPassword, validateUpdateAuthValues } from "../middleware/validationMiddleware.js";
import { changePassword, loginUser, registerUser, resetPassword, sendOTP, updateUserDetails, verfiyCode } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateRegisterAuthValues, registerUser)
router.route('/login').post(validateLoginAuthValues ,loginUser)
router.route('/user').put(validateUpdateAuthValues, updateUserDetails)
router.route('/user/changePassword').put(validateChangePasswordValues, changePassword)
router.route('/sendOTP').post(validateResetPassword, sendOTP)
router.route('/verifyCode').post(validateOtp, verfiyCode)
router.route('/resetPassword').post(validateNewResetPassword, resetPassword)

export default router