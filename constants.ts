
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
    label: 'Hero Shot (Centered)',
    emoji: '🎯',
    prompt: 'Front-facing hero shot, product perfectly centered on a natural wood or marble surface, soft diffused natural light from a side window, warm tones, clean composition with the product as the absolute star, realistic shadows, slightly blurred real interior background, 50mm lens'
  },
  {
    id: '45_angle',
    label: '45° Angle Showcase',
    emoji: '📐',
    prompt: '45-degree angled view on a linen cloth or raw wood table, natural window light, soft warm shadows, realistic depth, artisanal product presentation, cozy interior background, 50mm lens perspective, vibrant natural colors'
  },
  {
    id: 'side_profile',
    label: 'Side Profile',
    emoji: '◀️',
    prompt: 'Side profile view on a stone or wooden shelf, natural daylight, precise proportions, warm neutral background with subtle texture, realistic shadows consistent with single light source, product centered'
  },
  {
    id: 'top_view',
    label: 'Top View / Flat Lay',
    emoji: '⬇️',
    prompt: 'Top-down flat lay on a linen tablecloth or raw wood surface, surrounded by small natural props like dried flowers or a sprig of eucalyptus, soft ambient daylight, warm tones, artisan lifestyle photography, colorful and inviting'
  },
  {
    id: 'ultra_closeup',
    label: 'Ultra Close-Up (Texture)',
    emoji: '🔍',
    prompt: 'Close-up shot showing material texture and craftsmanship details, visible grain or stitching, natural soft light, shallow depth of field, 50mm macro perspective, emphasis on handmade quality and premium materials'
  },
  {
    id: 'lifestyle_home',
    label: 'Lifestyle Home Scene',
    emoji: '🏠',
    prompt: 'Product naturally placed in a real cozy home interior, natural sunlight streaming through a window, wooden furniture, plants, linen textiles, warm and authentic atmosphere, the product feels lived-in and integrated, real home not a studio'
  },
  {
    id: 'in_use_person',
    label: 'In-Use with Person',
    emoji: '🤲',
    prompt: 'Product shown being used or held by a person in a natural realistic setting, warm daylight, authentic and relatable scene, the product is the clear subject, hands or body visible but focus stays on the product, lifestyle Etsy photography'
  },
  {
    id: 'luxury_marble',
    label: 'Luxury Premium',
    emoji: '💎',
    prompt: 'Product on a white marble or travertine surface, elegant and luxurious feel, soft natural light, gold or brass accents nearby, premium boutique aesthetic, clean and sophisticated, warm color palette, the product looks expensive and desirable'
  },
  {
    id: 'golden_hour',
    label: 'Golden Hour',
    emoji: '🌅',
    prompt: 'Product bathed in warm golden hour sunlight, long soft shadows, rich warm color temperature, placed on a natural surface near a window, dreamy and inviting atmosphere, the light wraps around the product beautifully, editorial quality'
  },
  {
    id: 'summer_mood',
    label: 'Summer / Bright Mood',
    emoji: '☀️',
    prompt: 'Bright summer atmosphere, product on a light natural surface, abundant natural sunlight, fresh and airy feel, vibrant colors, maybe a plant or citrus fruit nearby, optimistic and joyful mood, outdoor terrace or sunlit room, Etsy bestseller aesthetic'
  },
  {
    id: 'evening_cozy',
    label: 'Evening / Cozy Mood',
    emoji: '🕯️',
    prompt: 'Warm evening atmosphere, product on a textured surface, soft warm lamp light or candlelight, intimate and cozy feeling, rich warm tones, maybe a knit blanket or book nearby, hygge aesthetic, the product feels like a perfect gift'
  },
  {
    id: 'gift_presentation',
    label: 'Gift Presentation',
    emoji: '�',
    prompt: 'Product presented as a beautiful gift, elegant wrapping paper or ribbon nearby, natural surface, warm soft light, the product looks like the perfect present, inviting and desirable, premium unboxing feel, Etsy gift guide aesthetic'
  },
  {
    id: 'outdoor_natural',
    label: 'Outdoor / Garden',
    emoji: '🌿',
    prompt: 'Product photographed outdoors in a natural garden or terrace setting, soft natural daylight, greenery and plants in the background with beautiful bokeh, fresh and organic feel, the product connects with nature, authentic lifestyle photography'
  },
  {
    id: 'minimal_clean',
    label: 'Minimal Clean',
    emoji: '✨',
    prompt: 'Product on a clean minimal surface, soft neutral tones, one or two subtle props maximum, lots of negative space, the product is the absolute hero, soft diffused light, elegant simplicity, premium Etsy listing thumbnail aesthetic'
  },
  {
    id: 'warm_editorial',
    label: 'Warm Editorial',
    emoji: '�',
    prompt: 'Editorial lifestyle photography, product on a natural stone or wooden surface, warm morning golden hour light, soft bokeh background with plants or books, high-end artisan boutique aesthetic, magazine-quality composition'
  },
  {
    id: 'kitchen_bathroom',
    label: 'Kitchen / Bathroom Context',
    emoji: '🚿',
    prompt: 'Product in a realistic kitchen or bathroom setting depending on product type, natural materials like wood and stone, warm ambient light, the product feels at home in this space, real interior not a showroom, authentic and aspirational'
  },
  {
    id: 'color_pop',
    label: 'Color Pop / Vibrant',
    emoji: '🎨',
    prompt: 'Product photographed with vibrant complementary colors in the scene, colorful but tasteful styling, natural light, the product pops against the background, eye-catching composition perfect for Etsy search results, scroll-stopping image'
  },
  {
    id: 'detail_craftsmanship',
    label: 'Detail / Craftsmanship',
    emoji: '⚙️',
    prompt: 'Close-up detail shot focusing on handmade craftsmanship elements, natural light highlighting texture and quality, warm tones, blurred cozy background, the image builds trust and shows the product is worth the price'
  },
  {
    id: 'scale_context',
    label: 'Scale / Size Context',
    emoji: '📏',
    prompt: 'Product shown next to everyday objects for scale reference, natural setting, warm light, the buyer can immediately understand the real size of the product, practical and informative but still beautiful, Etsy best practice'
  },
  {
    id: 'artisan_display',
    label: 'Artisan Market Display',
    emoji: '🏪',
    prompt: 'Product displayed as if in a beautiful artisan market stall or boutique shelf, surrounded by complementary items, warm ambient light, rustic wood and natural materials, the product feels curated and special, handmade market aesthetic'
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
