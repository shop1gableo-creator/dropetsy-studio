
export const GEMINI_TEXT_MODEL = 'gemini-3-pro-preview';
export const GEMINI_IMAGE_MODEL_FLASH = 'gemini-2.5-flash-image';
export const GEMINI_IMAGE_MODEL_PRO = 'gemini-3-pro-image-preview';
export const GEMINI_SEO_MODEL = 'gemini-3-flash-preview';

export const IMAGE_GENERATION_CONCURRENCY_LIMIT = 3;
export const IMAGE_GENERATION_WARNING = "Attention : la génération haute fidélité consomme des ressources.";
export const IMAGE_DOWNLOAD_FILENAME = "nanocreative-studio";

export const MAX_IMAGE_UPLOAD_SIZE_MB = 5;
export const MAX_IMAGE_DIMENSION_PX = 1024;
export const JPEG_COMPRESSION_QUALITY = 0.8;

export const API_KEY_MISSING_MESSAGE = "API key missing.";

export const RESOLUTIONS = [
  { id: '1k', label: '1K', pixels: '1024×1024', desc: 'Standard' },
  { id: '2k', label: '2K', pixels: '2048×2048', desc: 'High-Res' },
  { id: '4k', label: '4K', pixels: '4096×4096', desc: 'Ultra HD' },
] as const;

export type ResolutionId = typeof RESOLUTIONS[number]['id'];

export const IMAGE_PRICING: Record<string, Record<ResolutionId, number>> = {
  [GEMINI_IMAGE_MODEL_FLASH]: {
    '1k': 0.039,
    '2k': 0.079,
    '4k': 0.000, // not supported
  },
  [GEMINI_IMAGE_MODEL_PRO]: {
    '1k': 0.070,
    '2k': 0.134,
    '4k': 0.240,
  },
};

export const getImagePrice = (model: string, resolution: ResolutionId): number => {
  return IMAGE_PRICING[model]?.[resolution] ?? 0;
};

export const formatPrice = (price: number): string => {
  if (price === 0) return 'N/A';
  return `$${price.toFixed(3)}`;
};

export const SEO_IMAGE_POSITIONS = [
  {
    id: 'hero_shot',
    label: 'Hero Shot',
    emoji: '🎯',
    prompt: 'Front-facing hero shot, centered composition, product perfectly aligned, clean background, professional studio lighting, ultra-sharp focus, premium look, high resolution, e-commerce hero image'
  },
  {
    id: '45_angle',
    label: '45° Angle Showcase',
    emoji: '📐',
    prompt: '45-degree angled view, dynamic perspective, soft shadows, realistic depth, premium product presentation, modern studio setup, clean background'
  },
  {
    id: 'side_left',
    label: 'Side Profile (Left)',
    emoji: '◀️',
    prompt: 'Left side profile view, precise proportions, minimalist composition, realistic lighting, sharp edges, product isolated on neutral background'
  },
  {
    id: 'side_right',
    label: 'Side Profile (Right)',
    emoji: '▶️',
    prompt: 'Right side profile view, clean silhouette, studio lighting, accurate materials, high clarity, professional catalog style'
  },
  {
    id: 'top_view',
    label: 'Top View / Flat Lay',
    emoji: '⬇️',
    prompt: 'Top-down flat lay view, perfectly aligned, symmetrical composition, soft ambient light, clean surface, editorial product photography style'
  },
  {
    id: 'ultra_closeup',
    label: 'Ultra Close-Up (Texture)',
    emoji: '🔍',
    prompt: 'Ultra close-up macro shot, detailed texture, visible material grain, sharp focus, realistic reflections, premium craftsmanship emphasis'
  },
  {
    id: 'detail_focus',
    label: 'Detail Focus (Functional)',
    emoji: '⚙️',
    prompt: 'Close-up detail shot focusing on functional elements, precision engineering, clean background, professional lighting, product feature highlight'
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle Scene',
    emoji: '🏠',
    prompt: 'Lifestyle scene, product in real-world environment, natural lighting, realistic shadows, elegant modern setting, high-end interior design atmosphere'
  },
  {
    id: 'luxury_editorial',
    label: 'Luxury Editorial',
    emoji: '💎',
    prompt: 'Luxury editorial photography style, marble or premium surface, dramatic lighting, soft shadows, cinematic mood, high-end brand aesthetic'
  },
  {
    id: 'dark_premium',
    label: 'Dark Background Premium',
    emoji: '🖤',
    prompt: 'Product on dark background, dramatic contrast, rim lighting, premium cinematic look, high clarity, luxury branding style'
  },
  {
    id: 'exploded_view',
    label: 'Exploded / Detail View',
    emoji: '🔧',
    prompt: 'Technical showcase view, separated or emphasized components, clean layout, high clarity, professional product visualization style'
  },
  {
    id: 'ultra_zoom_dof',
    label: 'Ultra Zoom + Depth of Field',
    emoji: '📸',
    prompt: 'Extreme zoom shot with shallow depth of field, sharp focus on key detail, blurred background, cinematic realism, premium macro photography'
  }
];

export const STYLE_MATRIX = [
  {
    id: 'premium_luxury',
    label: 'Premium Luxury',
    prompt: 'A high-end luxury lounge featuring polished white Calacatta marble floors with deep grey veining. Accents of brushed gold on the furniture legs and wall moldings. Large floor-to-ceiling windows showing a sunset city skyline. Soft ambient warm lighting, cinematic composition, 8k resolution, elegant and opulent.'
  },
  {
    id: 'natural_wood',
    label: 'Natural Wood & Organic Earth',
    prompt: 'An interior space focused on biophilic design. Raw oak wooden beams, walls with a clay-plaster texture, and oversized terracotta vases. Plenty of indoor greenery and olive trees. Soft, natural sunlight filtering through linen curtains, earthy tones, wabi-sabi aesthetic, serene and grounded.'
  },
  {
    id: 'minimalist_studio',
    label: 'High-End Minimalist Studio',
    prompt: 'An ultra-minimalist photography studio, monochromatic white-on-white. Architectural curves, a single designer chair in the center, sharp shadows, and high contrast. Empty space as a luxury, museum-like atmosphere, crisp lines, professional studio lighting.'
  },
  {
    id: 'urban_industrial',
    label: 'Urban Industrial & Concrete',
    prompt: 'A spacious loft with polished concrete walls and exposed steel pipes. Large black-framed Crittall windows. A cognac leather sofa and a reclaimed wood coffee table. Cold daylight, gritty but sophisticated, architectural photography, urban textures.'
  },
  {
    id: 'dark_academia',
    label: 'Dark Academia & Moody',
    prompt: 'A private library at night. Dark walnut bookshelves filled with old leather-bound books. A single desk lamp casting a warm glow on a velvet green chair. Heavy shadows, mahogany wood, intellectual and mysterious atmosphere, cinematic moody lighting.'
  },
  {
    id: 'japandi',
    label: 'Japandi (Wood & White)',
    prompt: 'A peaceful fusion of Japanese and Scandinavian design. Light ash wood furniture, low-profile bed, sliding shoji-style screens, and off-white textured walls. Minimalist decor, balanced composition, soft diffused light, Zen feeling.'
  },
  {
    id: 'neo_vintage',
    label: 'Neo-Vintage & Brass',
    prompt: 'A boutique hotel lobby with a "New Retro" vibe. Mid-century modern furniture, velvet upholstery in teal and mustard, and ornate brass light fixtures. Art deco patterns, rich colors, nostalgic yet modern, high-end craftsmanship.'
  },
  {
    id: 'glass_transparency',
    label: 'Glass & Transparency',
    prompt: 'A futuristic glass pavilion in a forest. Transparent walls reflecting the surrounding trees. Ghost chairs made of acrylic, glass tables, and layered transparency. Play of light and reflections, ethereal, airy, and ultra-modern.'
  },
  {
    id: 'soft_editorial',
    label: 'Soft Editorial (Linen & Light)',
    prompt: 'A close-up editorial shot of a cream linen sofa. Soft morning light creating a "dreamy" haze. Beige tones, crumpled natural fabrics, dried pampas grass in the background. Calm, tactile, lifestyle photography, high-end magazine aesthetic.'
  },
  {
    id: 'matte_black_tech',
    label: 'Matte Black & Tech Night',
    prompt: 'A high-tech home office at night. Matte black walls, a clean carbon-fiber desk, and subtle purple and blue LED accent strips. A cozy ergonomic chair, rain on the window, lofi-beats atmosphere, sleek, stealthy, and futuristic.'
  }
];
