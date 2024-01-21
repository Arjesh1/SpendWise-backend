import { Router } from "express";
import { archiveTransaction, createTransaction, getUserTransaction, updateTransaction } from "../controllers/transactionController.js";
import { validateTransactionValues } from "../middleware/validationMiddleware.js";
const router = Router()

router.route('/:token').get(getUserTransaction).post(validateTransactionValues, createTransaction).put(updateTransaction)
router.route('/:token/delete').put(archiveTransaction)

export default router