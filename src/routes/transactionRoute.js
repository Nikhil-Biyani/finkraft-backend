import express from "express";
import multer from "multer";
import { postTransactionController, getTransactionController, updateTransactionController, deleteTransactionController } from "../controllers/transactionController.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/upload", upload.single("file"), postTransactionController);
router.get("/retrieve", getTransactionController);
router.put("/update/:id", updateTransactionController);
router.delete("/remove/:id", deleteTransactionController);

export default router;