import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateServiceRecommendation = async (clientData: any) => {
  const prompt = `
    You are an expert makeup artist assistant. Based on the following client profile, recommend a new makeup service or package they might be interested in.
    Keep the recommendation concise, professional, and personalized. Output only the recommendation text (max 3 sentences).
    
    Client Name: ${clientData.name}
    Tags: ${clientData.tags.join(', ')}
    Notes: ${clientData.notes}
    Past Services: ${clientData.history.map((h: any) => h.service).join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return "Unable to generate recommendation at this time. Please try again later.";
  }
};
