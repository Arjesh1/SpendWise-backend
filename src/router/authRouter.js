import { Router } from "express";
import { validateLoginAuthValues, validateRegisterAuthValues } from "../middleware/validationMiddleware.js";
import { changePassword, loginUser, registerUser, updateUserDetails } from "../controllers/authController.js";
const router = Router()

router.route('/register').post(validateRegisterAuthValues, registerUser)
router.route('/login').post(validateLoginAuthValues ,loginUser)
router.route('/user').put(updateUserDetails)
router.route('/user/changePassword').put(changePassword)

export default router