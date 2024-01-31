import { Router } from "express";
import { uploadImages } from "../controllers/uploadController.js";
import multer from "multer";

const router = Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

router.route('/').post(upload.single('image'), uploadImages)


export default router