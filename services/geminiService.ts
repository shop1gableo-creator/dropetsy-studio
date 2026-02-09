
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL_PRO, GEMINI_IMAGE_MODEL_FLASH, GEMINI_SEO_MODEL, API_KEY_MISSING_MESSAGE } from '../constants';
import { SeoResult, UploadedImage } from '../types';

const getGeminiClient = (apiKey: string) => {
  if (!apiKey) throw new Error(API_KEY_MISSING_MESSAGE);
  return new GoogleGenAI({ apiKey });
};

export async function testSpecificApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey) throw new Error("Clé vide.");
  try {
    const ai = getGeminiClient(apiKey);
    await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: [{ parts: [{ text: 'ping' }] }],
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (error: any) {
    throw new Error(`Erreur validation API`);
  }
}

export async function generatePrompts(
  apiKey: string,
  productDescription: string | null = null,
  backgroundContext: string = "",
  referenceImages: UploadedImage[] = [],
  chatInput: string = "",
  inAndOutMode: boolean = false,
  numPrompts: number = 12
): Promise<string[]> {
  const ai = getGeminiClient(apiKey);
  const parts: Part[] = [];
  
  let backgroundInstruction = backgroundContext;
  if (backgroundContext.includes("automatically analyzed")) {
    backgroundInstruction = `ANALYZE PRODUCT FIRST: Detect product category and materials. 
CREATE CONTEXT: Design an environment that is "realistic to death" (très réaliste à mort). 
Atmospheric, logical, high-end lifestyle settings only. Use descriptors like "natural sunlight", "soft window bokeh", "organic high-end home", or "authentic street texture". 
Avoid sterile AI backgrounds. Ensure the product feels integrated into a real space. Cinematic hyper-realism.`;
  }

  let textPrompt = `You are a world-class professional product photographer. Generate exactly ${numPrompts} unique image prompts for the product in the reference.

**CORE RULES:**
1. **PRODUCT IDENTITY**: The subject MUST remain 100% identical. Every logo, texture, and shape.
2. **REALISM**: Backgrounds must be ultra-realistic, cinematic, and professional. Use "realistic to death" style.
3. **VARIETY**: Use different angles (45°, flatlay, macro, lifestyle, eye-level).
4. **CONTEXT**: ${backgroundInstruction}.
5. **FORMAT**: Just ${numPrompts} lines of plain text. NO BOLD. NO ASTERISKS.`;

  if (inAndOutMode) {
    textPrompt += `\n\n**IN-AND-OUT PROTOCOL**: Preserve pixel-perfect branding and silhouette.`;
  }

  if (chatInput.trim()) {
    textPrompt += `\n\n**USER CUSTOMIZATION**: ${chatInput}.`;
  }

  if (referenceImages.length > 0) {
    referenceImages.forEach(img => {
      parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    });
  }
  
  parts.push({ text: textPrompt + `\n\nProduct Name/Context: ${productDescription || 'Preserve reference identity'}` });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: { parts: parts },
      config: { 
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });

    const text = (response.text || "").replace(/\*/g, '');
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 10)
      .slice(0, numPrompts);
  } catch (error) {
    throw new Error("Erreur lors de la génération des scénarios.");
  }
}

export async function generateImage(
  apiKey: string,
  prompt: string,
  imageConfig?: { aspectRatio?: string, inAndOutMode?: boolean },
  referenceImages: UploadedImage[] = [],
  modelName: string = GEMINI_IMAGE_MODEL_FLASH
): Promise<string> {
  const ai = getGeminiClient(apiKey);
  const parts: Part[] = [];
  
  let identityInstruction = `SUBJECT: Keep the EXACT object from the reference. Branding and shape must be 100% accurate. `;
  if (imageConfig?.inAndOutMode) {
    identityInstruction = `**IN-AND-OUT MODE**: Ensure zero drift on the product. SCENE: `;
  } else {
    identityInstruction += `SCENE: `;
  }

  if (referenceImages.length > 0) {
    parts.push({ text: (identityInstruction + prompt + ". Hyper-realistic, professional lighting, natural environment, extremely detailed, 8k, realistic to death.").replace(/\*/g, '') });
    referenceImages.forEach(img => {
      parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    });
  } else {
    parts.push({ text: (prompt + ". Ultra-realistic professional photography.").replace(/\*/g, '') });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: { imageConfig: { aspectRatio: imageConfig?.aspectRatio || "1:1" } }
    });
    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (!part?.inlineData) throw new Error("Échec du rendu image.");
    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  } catch (error: any) {
    throw new Error(`Erreur Image Studio : ${error.message}`);
  }
}

export async function generateSeoContent(apiKey: string, imageData: string, mimeType: string, extraDetails?: string): Promise<SeoResult> {
  const ai = getGeminiClient(apiKey);
  const textPrompt = `You are an Elite Etsy SEO Expert. Generate a 100% optimized listing in JSON: {"title": "...", "description": "...", "tags": "...", "category": "..."}.

**TASK:**
1. **EXCEPTIONAL SEO TITLE**: Max 140 chars. Use high-volume keywords. Include variants (colors/sizes) if provided by the user.
2. **USER CONTEXT INTEGRATION (CRITICAL)**: Use the provided text to mention ALL color options and technical variations. Do not limit yourself to what's in the photo. 
   - If user says "Red, Blue, Green", mention "Available in 3 colors" in title/description.
3. **DEEP RESEARCH**: Use Google Search to find this product on AliExpress/Amazon/Etsy to extract real technical specs (Materials, Sizes, Weight).
4. **STORYTELLING & SPECS**:
   - 2 paragraphs of evocative storytelling.
   - "TECHNICAL DETAILS" section with Materials, Sizes, and Variation list.
   - "--- FREQUENTLY ASKED QUESTIONS ---" section at the end.
5. **FLUID FAQ**: NO "Q:" or "A:". Question clearly stated, followed by conversational answer.
6. **13 TAGS**: Exactly 13 high-value Etsy tags based on trending search terms.
7. **FORMAT**: Clean JSON, no markdown syntax in values.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_SEO_MODEL,
      contents: { 
        parts: [
          { inlineData: { data: imageData, mimeType } }, 
          { text: textPrompt + `\nUSER PROVIDED SPECIFIC DETAILS: ${extraDetails || 'No extra details'}` }
        ] 
      },
      config: { 
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 8000 }
      },
    });

    const result = JSON.parse(response.text || "{}");
    const clean = (s: string) => s.replace(/\*/g, '');
    if (result.title) result.title = clean(result.title);
    if (result.description) result.description = clean(result.description);
    return result;
  } catch (error) {
    console.error("SEO Error:", error);
    throw new Error("Erreur de génération SEO.");
  }
}
