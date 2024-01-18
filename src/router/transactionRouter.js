import { Router } from "express";
import { createTransaction } from "../controllers/transactionController.js";
const router = Router()

router.route('/').post(createTransaction)

export default router