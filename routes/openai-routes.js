import express from 'express';
import { createImage, createTranslation, createCompletion, replicateSubtitles } from '../controllers/controllers.js';

const router = express.Router();

router.get('/');
router.post('/image', createImage);
router.post('/translate', createTranslation);
router.post('/chat', createCompletion);
router.post('/replicate-subs', replicateSubtitles);

export default router