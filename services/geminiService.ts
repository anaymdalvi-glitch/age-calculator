
import { GoogleGenAI, Type } from "@google/genai";
import { CalculationResult, FunFacts } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Fun Facts feature will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const funFactsSchema = {
  type: Type.OBJECT,
  properties: {
    personalityTrait: {
      type: Type.STRING,
      description: "A short, fun personality trait summary based on the provided zodiac signs (Western and Chinese)."
    },
    famousPeers: {
      type: Type.ARRAY,
      description: "A list of 3-4 famous people who were born on the same day and month.",
      items: { type: Type.STRING }
    },
    historicalEvent: {
      type: Type.STRING,
      description: "A short description of a significant historical event that occurred on this day and month in any year."
    }
  },
  required: ["personalityTrait", "famousPeers", "historicalEvent"]
};

export async function getBirthDateFacts(result: CalculationResult): Promise<FunFacts> {
  if (!API_KEY) {
    throw new Error("API key is not configured.");
  }
  
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Generate fun facts for a person with the following birth details:
    - Date of Birth: ${result.birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
    - Day of the Week: ${result.dayOfWeek}
    - Western Zodiac Sign: ${result.zodiacSign}
    - Chinese Zodiac Animal: ${result.chineseZodiac}

    Please provide the information in a JSON format matching the defined schema. The tone should be light, positive, and engaging.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: funFactsSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Basic validation to ensure the response matches the expected structure
    if (parsedJson.personalityTrait && Array.isArray(parsedJson.famousPeers) && parsedJson.historicalEvent) {
       return parsedJson as FunFacts;
    } else {
        throw new Error("Received malformed data from AI.");
    }

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to generate fun facts from Gemini API.");
  }
}
