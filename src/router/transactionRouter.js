import { Router } from "express";
import { createTransaction } from "../controllers/transactionController.js";
import { validateTransactionValues } from "../middleware/validationMiddleware.js";
const router = Router()

router.route('/').post(validateTransactionValues, createTransaction)

export default router