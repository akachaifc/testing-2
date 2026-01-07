
import { GoogleGenAI, Type } from "@google/genai";
import { TopicContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTopicContent = async (topic: string): Promise<TopicContent> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a comprehensive educational overview of the topic: "${topic}". 
               Include a catchy title, a detailed 2-paragraph summary, 5 interesting facts, 
               4 statistical data points (label and a numeric value between 1 and 100), 
               and 3 common questions and answers.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          facts: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          stats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["label", "value"]
            }
          },
          qAndA: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          }
        },
        required: ["title", "summary", "facts", "stats", "qAndA"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as TopicContent;
};

export const generateTopicImage = async (topic: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high-quality, professional, and visually stunning cinematic illustration representing "${topic}". Modern style, clear composition.` }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed", error);
    return `https://picsum.photos/seed/${topic}/800/400`;
  }
};
