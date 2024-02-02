import { Router } from "express";
import { validateChangePasswordValues, validateLoginAuthValues, validateRegisterAuthValues, validateUpdateAuthValues } from "../middleware/validationMiddleware.js";
import { changePassword, loginUser, registerUser, updateUserDetails } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateRegisterAuthValues, registerUser)
router.route('/login').post(validateLoginAuthValues ,loginUser)
router.route('/user').put(validateUpdateAuthValues, updateUserDetails)
router.route('/user/changePassword').put(validateChangePasswordValues, changePassword)

export default router