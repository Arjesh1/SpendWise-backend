import { Router } from "express";
import { uploadImages } from "../controllers/uploadController";

const router = Router()

router.route('/').post(uploadImages)


export default router