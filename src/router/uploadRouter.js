import { Router } from "express";
import { uploadImages } from "../controllers/uploadController.js";

const router = Router()

router.route('/').get(uploadImages)


export default router