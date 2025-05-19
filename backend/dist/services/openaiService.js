"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeText = analyzeText;
exports.analyzeImage = analyzeImage;
exports.analyzeDocument = analyzeDocument;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
async function analyzeText(prompt) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente médico AI. Proporciona información médica precisa y siempre recuerda incluir un descargo de responsabilidad cuando sea necesario."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
        });
        return completion.choices[0].message;
    }
    catch (error) {
        console.error('Error al analizar texto:', error);
        throw error;
    }
}
async function analyzeImage(imageUrl, prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente médico especializado en análisis de imágenes médicas."
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl,
                                detail: "high"
                            }
                        }
                    ]
                }
            ],
            max_tokens: 500,
        });
        return response.choices[0].message;
    }
    catch (error) {
        console.error('Error al analizar imagen:', error);
        throw error;
    }
}
async function analyzeDocument(documentText) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente médico especializado en análisis de documentos médicos."
                },
                {
                    role: "user",
                    content: `Por favor, analiza el siguiente documento médico y proporciona un resumen y puntos clave: ${documentText}`
                }
            ],
            temperature: 0.5,
        });
        return completion.choices[0].message;
    }
    catch (error) {
        console.error('Error al analizar documento:', error);
        throw error;
    }
}
