import { Router } from "express";
import { createTransaction, getUserTransaction } from "../controllers/transactionController.js";
import { validateTransactionValues } from "../middleware/validationMiddleware.js";
const router = Router()

router.route('/').get(getUserTransaction).post(validateTransactionValues, createTransaction)

export default router