"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openaiService_1 = require("../services/openaiService");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
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
        const analysis = await (0, openaiService_1.analyzeText)(prompt);
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Error al analizar texto' });
    }
});
// Ruta para análisis de imágenes
router.post('/analyze-image', upload.single('image'), async (req, res) => {
    try {
        const { prompt } = req.body;
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
        const analysis = await (0, openaiService_1.analyzeImage)(imageUrl, prompt);
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Error al analizar imagen' });
    }
});
// Ruta para análisis de documentos
router.post('/analyze-document', upload.single('document'), async (req, res) => {
    try {
        const { text } = req.body;
        const analysis = await (0, openaiService_1.analyzeDocument)(text);
        res.json({ success: true, data: analysis });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Error al analizar documento' });
    }
});
exports.default = router;
