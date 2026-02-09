
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_IMAGE_MODEL_PRO, GEMINI_IMAGE_MODEL_FLASH, GEMINI_SEO_MODEL, API_KEY_MISSING_MESSAGE, SEO_IMAGE_POSITIONS } from '../constants';
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
  numPrompts: number = 12,
  brandBrain: string = ""
): Promise<string[]> {
  const ai = getGeminiClient(apiKey);
  const parts: Part[] = [];
  
  let backgroundInstruction = backgroundContext;
  if (backgroundContext.includes("automatically analyzed")) {
    backgroundInstruction = `ANALYZE PRODUCT FIRST: Detect product category, materials, size, target audience. 
CREATE CONTEXT: Design environments that are "realistic to death". 
Use descriptors like "natural sunlight streaming through window", "soft window bokeh", "organic high-end Scandinavian home", "authentic artisan workshop", "warm morning kitchen counter", "premium marble vanity". 
Avoid sterile AI backgrounds. The product must feel INTEGRATED into a real space. Cinematic hyper-realism.`;
  }

  // Build the SEO positions reference for the AI
  const seoPositionsRef = SEO_IMAGE_POSITIONS.map((pos, i) => 
    `${i + 1}. ${pos.label}: ${pos.prompt}`
  ).join('\n');

  let textPrompt = `You are an ELITE Etsy product photographer and SEO visual strategist. You create prompts that generate images which SELL on Etsy, Amazon, and Shopify.

Generate exactly ${numPrompts} unique, highly detailed image prompts for the product shown in the reference images.

=== MASTER SEO IMAGE POSITIONS (use these as your framework) ===
${seoPositionsRef}

=== ABSOLUTE RULES ===
1. PRODUCT IDENTITY: The subject MUST remain 100% identical — every logo, texture, color, shape, and material. ZERO creative liberty on the product itself.
2. ULTRA-REALISM: Every image must look like it was shot by a $5000/day photographer. "Realistic to death" — real shadows, real reflections, real light behavior.
3. STRATEGIC VARIETY: Distribute prompts across different SEO positions above. Each prompt = different angle, different mood, different conversion intent.
4. LONG & DETAILED: Each prompt must be 40-80 words minimum. Include lighting direction, surface material, atmosphere, color temperature, camera angle, depth of field.
5. ETSY-OPTIMIZED: Think about what makes a buyer CLICK and BUY. Hero shots for thumbnails, lifestyle for emotional connection, close-ups for trust.
6. BACKGROUND CONTEXT: ${backgroundInstruction}
7. FORMAT: Return ONLY ${numPrompts} lines of plain text prompts. NO numbering, NO bold, NO asterisks, NO markdown. One prompt per line.

=== PROVEN PROMPT PATTERNS ===
- "Product centered on [surface], [lighting type], [atmosphere], [camera angle], [lens effect], professional product photography, 8k, hyper-detailed"
- "Close-up of [product feature] showing [material texture], [lighting], shallow depth of field, macro lens, premium craftsmanship"
- "[Product] in [lifestyle setting], [time of day lighting], [mood], editorial photography, high-end magazine aesthetic"
- "[Product] on [dark/light surface], [dramatic/soft] lighting, rim light highlighting [feature], luxury branding style"`;

  if (brandBrain && brandBrain.trim()) {
    textPrompt += `\n\n=== BRAND CONTEXT (respect this) ===\n${brandBrain}`;
  }

  if (inAndOutMode) {
    textPrompt += `\n\n=== IN-AND-OUT PROTOCOL ===\nPreserve pixel-perfect branding, silhouette, and every surface detail. The product must be IDENTICAL to the reference — only the environment changes.`;
  }

  if (chatInput.trim()) {
    textPrompt += `\n\n=== USER CREATIVE DIRECTION ===\n${chatInput}`;
  }

  if (referenceImages.length > 0) {
    referenceImages.forEach(img => {
      parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    });
  }
  
  parts.push({ text: textPrompt + `\n\nProduct Name/Context: ${productDescription || 'Analyze from reference images — preserve identity'}` });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: { parts: parts },
      config: { 
        temperature: 0.85,
        thinkingConfig: { thinkingBudget: 6000 }
      },
    });

    const text = (response.text || "").replace(/\*/g, '');
    return text.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 15)
      .slice(0, numPrompts);
  } catch (error) {
    throw new Error("Error generating prompts. Please check your API key and try again.");
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
  
  const isPro = modelName === GEMINI_IMAGE_MODEL_PRO;
  
  let identityInstruction = isPro
    ? `ELITE PRODUCT PHOTOGRAPHY MODE. You are generating for a premium e-commerce listing. SUBJECT INTEGRITY: The product from the reference must be reproduced with ZERO drift — every logo, label, texture, color, proportion, and surface detail must be pixel-perfect. `
    : `PRODUCT PHOTOGRAPHY MODE. SUBJECT: Keep the EXACT object from the reference. Branding, shape, and materials must be 100% accurate. `;
  
  if (imageConfig?.inAndOutMode) {
    identityInstruction += `IN-AND-OUT PROTOCOL: The product is SACRED — only the environment changes. `;
  }
  identityInstruction += `SCENE: `;

  const qualitySuffix = isPro
    ? '. Shot on Phase One IQ4 150MP, ultra-sharp, hyper-realistic, professional studio lighting with subtle fill, natural color grading, realistic shadows and reflections, 8k resolution, cinematic depth of field, editorial product photography.'
    : '. Hyper-realistic, professional lighting, natural environment, extremely detailed, 8k, realistic to death, sharp focus.';

  if (referenceImages.length > 0) {
    parts.push({ text: (identityInstruction + prompt + qualitySuffix).replace(/\*/g, '') });
    referenceImages.forEach(img => {
      parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
    });
  } else {
    parts.push({ text: (prompt + qualitySuffix).replace(/\*/g, '') });
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
