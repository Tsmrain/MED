import express from 'express';
import { analyzeText, analyzeImage, analyzeDocument } from '../services/openaiService';
import multer from 'multer';
import path from 'path';

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

// Ruta para análisis de texto
router.post('/analyze-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    const analysis = await analyzeText(prompt);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al analizar texto' });
  }
});

// Ruta para análisis de imágenes
router.post('/analyze-image', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
    const analysis = await analyzeImage(imageUrl, prompt);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al analizar imagen' });
  }
});

// Ruta para análisis de documentos
router.post('/analyze-document', upload.single('document'), async (req, res) => {
  try {
    const { text } = req.body;
    const analysis = await analyzeDocument(text);
    res.json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al analizar documento' });
  }
});

export default router;
