
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
CREATE CONTEXT: Design environments that feel like a REAL artisan home or workshop. 
Use descriptors like "natural sunlight streaming through linen curtains", "soft window bokeh", "warm wooden kitchen counter", "rustic oak shelf", "cozy living room with plants", "handmade workshop table". 
NEVER use sterile studio backgrounds. The product must feel INTEGRATED into a real, lived-in space. Handmade authenticity.`;
  }

  // Build the SEO positions reference for the AI
  const seoPositionsRef = SEO_IMAGE_POSITIONS.map((pos, i) => 
    `${i + 1}. ${pos.label}: ${pos.prompt}`
  ).join('\n');

  let textPrompt = `You are an expert product photographer specialized in handmade, artisanal, and Etsy-style product photography.

Your absolute priority is TOTAL RESPECT of the product provided. Generate exactly ${numPrompts} unique, highly detailed image prompts for the product shown in the reference images.

=== MASTER SEO IMAGE POSITIONS (use these as your framework) ===
${seoPositionsRef}

=== STRICT RULES — NON-NEGOTIABLE ===

PRODUCT INTEGRITY (SACRED):
- NEVER modify the product shape, proportions, materials, colors, logos, or any detail
- NEVER add or remove elements from the product itself
- NEVER stylize or redesign the product — it must be a FAITHFUL and EXACT reproduction
- The product must remain IDENTICAL to the reference in every single image

REALISTIC SCALE:
- ALWAYS maintain realistic size — compare mentally to surrounding objects
- NEVER artificially enlarge or shrink the product
- Objects around the product must be proportionally correct

PHYSICAL COHERENCE:
- Respect gravity — no floating objects
- Shadows must be consistent with a single main light source
- Realistic perspective — no impossible angles
- No optical distortion, no fisheye, no stretched zoom

MANDATORY VISUAL STYLE:
- Handmade, artisanal, Etsy lifestyle, natural, warm, authentic
- Surfaces: natural wood, linen, stone, textured walls, real interiors
- Lighting: ONLY natural diffused light, side window light, soft warm shadows
- The product is ALWAYS the main subject. Decor is secondary and subtle.
- Camera: 35mm or 50mm perspective, eye-level or slight angle, realistic depth of field

ABSOLUTELY FORBIDDEN:
- No empty black backgrounds
- No generic Shopify/Amazon studio look
- No harsh flash lighting
- No deformed macro shots
- No fisheye or stretched effects
- No ultra-commercial sterile renders

PROMPT FORMAT:
- Each prompt must be 40-80 words minimum
- Include: lighting direction, surface material, atmosphere, color temperature, camera angle, depth of field
- Return ONLY ${numPrompts} lines of plain text. NO numbering, NO bold, NO asterisks, NO markdown. One prompt per line.

BACKGROUND CONTEXT: ${backgroundInstruction}

=== PROMPT PATTERNS ===
- "Product centered on [natural wood/linen/stone surface], natural window light from the left, warm tones, [cozy interior] slightly blurred in background, 50mm lens, handmade artisan photography"
- "Close-up of [product detail] showing [texture/stitching/grain], soft natural light, shallow depth of field, emphasis on craftsmanship quality"
- "[Product] in [real home setting], morning sunlight through curtains, warm atmosphere, plants and natural elements, authentic lifestyle Etsy photography"
- "[Product] on [rustic shelf/vintage tray], surrounded by [dried flowers/books/natural props], soft diffused light, artisan boutique aesthetic"`;

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
    ? `HANDMADE PRODUCT PHOTOGRAPHY — PREMIUM MODE. ABSOLUTE RULES: The product from the reference must be reproduced with ZERO modification — every logo, label, texture, color, proportion, material, and surface detail must be pixel-perfect identical. NEVER modify, stylize, or redesign the product. NEVER add or remove elements from the product. Maintain realistic scale compared to surrounding objects. Respect gravity — no floating objects. Shadows consistent with a single natural light source. `
    : `HANDMADE PRODUCT PHOTOGRAPHY MODE. SACRED RULE: The product must be an EXACT faithful reproduction of the reference — shape, color, material, proportions, logos, every detail identical. NEVER modify the product. Maintain realistic scale. No floating objects. Single natural light source with consistent shadows. `;
  
  if (imageConfig?.inAndOutMode) {
    identityInstruction += `IN-AND-OUT PROTOCOL: The product is SACRED and UNTOUCHABLE — only the environment changes. `;
  }
  identityInstruction += `MANDATORY STYLE: Handmade, artisanal, Etsy lifestyle. Natural diffused light only (window light, no flash). Surfaces: natural wood, linen, stone. Real cozy interior, not a studio. No black backgrounds, no Shopify/Amazon generic look, no harsh lighting, no fisheye, no distortion. The product is the main subject, decor is secondary and subtle. 35mm or 50mm perspective. SCENE: `;

  const qualitySuffix = isPro
    ? '. Natural diffused window light, warm tones, realistic shadows from single light source, handmade artisan photography, real interior environment, 50mm lens perspective, shallow depth of field, authentic Etsy lifestyle aesthetic, hyper-realistic, 8k resolution.'
    : '. Natural window light, warm cozy atmosphere, realistic shadows, handmade artisan feel, real interior background, 50mm lens, authentic Etsy lifestyle photography, hyper-realistic, sharp focus.';

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
