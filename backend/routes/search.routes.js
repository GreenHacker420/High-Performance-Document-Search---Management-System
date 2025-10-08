import express from 'express';
import { SearchController } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/', SearchController.search);
router.get('/suggestions', SearchController.getSuggestions);

export default router;
