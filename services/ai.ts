import { GoogleGenAI, Type } from "@google/genai";
import { RecognitionResponse } from "../types";

// Initialize Gemini Client
// Note: In a real production app, API keys should be handled via backend proxy.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFrame = async (base64Image: string): Promise<RecognitionResponse> => {
  try {
    // We strip the data url prefix if present to send raw base64
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Extract the license plate number from this image. Return the result in JSON format with a single key 'plate'. If no license plate is clearly visible or legible, return null for the value. The plate may be Chinese. Ignore branding text."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plate: {
              type: Type.STRING,
              nullable: true,
              description: "The extracted license plate number or null if not found."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return { plate: null };

    try {
      const json = JSON.parse(text);
      return { plate: json.plate };
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini", e);
      return { plate: null };
    }

  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    return { plate: null };
  }
};