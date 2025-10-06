import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { PdfController } from '../controllers/pdf.controller.js';
import { config } from '../config/env.js';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = config.upload.uploadDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

router.get('/', PdfController.getAll);
router.get('/:id', PdfController.getById);
router.post('/', upload.single('file'), PdfController.upload);
router.delete('/:id', PdfController.delete);
router.get('/:id/download', PdfController.download);

export default router;
