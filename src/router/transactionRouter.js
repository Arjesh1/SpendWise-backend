import { Router } from "express";
import { archiveTransaction, createTransaction, getUserTransaction, updateTransaction } from "../controllers/transactionController.js";
import { validateTransactionValues } from "../middleware/validationMiddleware.js";
const router = Router()

router.route('/').get(getUserTransaction).post(validateTransactionValues, createTransaction).put(validateTransactionValues, updateTransaction)
router.route('/delete/:token').put(archiveTransaction)

export default router