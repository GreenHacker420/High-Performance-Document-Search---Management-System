import express from 'express';
import { WebLinkController } from '../controllers/weblink.controller.js';

const router = express.Router();

router.get('/', WebLinkController.getAll);
router.get('/:id', WebLinkController.getById);
router.post('/', WebLinkController.create);
router.put('/:id', WebLinkController.update);
router.delete('/:id', WebLinkController.delete);

export default router;
