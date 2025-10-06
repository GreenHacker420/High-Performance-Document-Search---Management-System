import express from 'express';
import { FaqController } from '../controllers/faq.controller.js';

const router = express.Router();

router.get('/', FaqController.getAll);
router.get('/:id', FaqController.getById);
router.post('/', FaqController.create);
router.put('/:id', FaqController.update);
router.delete('/:id', FaqController.delete);

export default router;
