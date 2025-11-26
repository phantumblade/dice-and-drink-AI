import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini 3 Pro Preview with Thinking Mode for complex assistant queries.
 */
export const askAiAssistant = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget
      },
    });
    return response.text || "Sto pensando, ma non riesco a trovare una risposta.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "Scusa, i miei circuiti sono intasati. Riprova più tardi.";
  }
};

/**
 * Uses Gemini 2.5 Flash Image to edit an image based on a prompt.
 * Note: The prompt uses `generateContent` with both image and text as per guidelines for editing.
 */
export const editProductImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    
    const textPart = {
      text: prompt
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Specific model for image tasks
      contents: { parts: [imagePart, textPart] },
      // No specific config needed for basic editing unless we want to enforce aspect ratio, 
      // but keeping it simple for edit tasks.
    });

    // Iterate to find the image part in the response
    for (const candidate of response.candidates || []) {
        if (candidate.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return part.inlineData.data;
                }
            }
        }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", JSON.stringify(error));
    throw error;
  }
};