export type BlogLocale = "en" | "pt" | "es";

export type BlogPost = {
  slug: string;
  category: string;
  publishedAt: string;
  title: string;
  excerpt: string;
  content: string[];
};

type LocalizedBlogPost = {
  slug: string;
  category: string;
  publishedAt: string;
  title: Record<BlogLocale, string>;
  excerpt: Record<BlogLocale, string>;
  content: Record<BlogLocale, string[]>;
};

const BLOG_POSTS: LocalizedBlogPost[] = [
  {
    slug: "best-exterior-paint-types-for-florida-weather",
    category: "Painting Tips",
    publishedAt: "2026-03-22T09:00:00.000Z",
    title: {
      en: "Best Exterior Paint Types for Florida Weather",
      pt: "Melhores Tintas Externas para o Clima da Florida",
      es: "Mejores Pinturas Exteriores para el Clima de Florida"
    },
    excerpt: {
      en: "Understand which paint formulas handle humidity, UV and heavy rain in Central Florida.",
      pt: "Entenda quais formulacoes suportam umidade, sol forte e chuva intensa na Florida Central.",
      es: "Entienda que formulas soportan humedad, sol fuerte y lluvia intensa en Florida Central."
    },
    content: {
      en: [
        "Florida exteriors demand coatings that resist UV exposure, moisture and mildew growth.",
        "For most homes, high-quality acrylic latex paint offers the best balance of durability, flexibility and color retention.",
        "Always pair premium paint with proper pressure washing, scraping and primer to maximize lifespan."
      ],
      pt: [
        "Fachadas na Florida exigem produtos que resistam a UV, umidade e mofo.",
        "Na maioria dos casos, tinta acrilica latex premium oferece o melhor equilibrio entre durabilidade e retencao de cor.",
        "Sempre combine produto de qualidade com lavagem, raspagem e primer para aumentar a vida util."
      ],
      es: [
        "Las fachadas en Florida exigen productos que resistan rayos UV, humedad y moho.",
        "En la mayoria de los casos, la pintura acrilica latex premium ofrece el mejor equilibrio entre durabilidad y color.",
        "Siempre combine pintura de calidad con lavado, raspado e imprimacion para mayor vida util."
      ]
    }
  },
  {
    slug: "interior-color-trends-in-orlando-homes-2026",
    category: "Color Trends",
    publishedAt: "2026-03-26T09:00:00.000Z",
    title: {
      en: "Interior Color Trends in Orlando Homes (2026)",
      pt: "Tendencias de Cores para Interiores em Orlando (2026)",
      es: "Tendencias de Color para Interiores en Orlando (2026)"
    },
    excerpt: {
      en: "Explore neutral palettes with warm accents that fit modern Florida interiors.",
      pt: "Veja paletas neutras com acentos quentes que combinam com interiores modernos na Florida.",
      es: "Explore paletas neutras con acentos calidos para interiores modernos en Florida."
    },
    content: {
      en: [
        "Orlando homeowners are choosing warm whites, soft greige and muted earthy tones.",
        "These colors reflect natural light beautifully while still feeling cozy and upscale.",
        "Accent walls in deep olive or clay can add personality without overpowering the room."
      ],
      pt: [
        "Em Orlando, muitos clientes estao escolhendo branco quente, greige suave e tons terrosos discretos.",
        "Essas cores valorizam a luz natural e mantem um aspecto elegante e acolhedor.",
        "Paredes de destaque em verde oliva ou terracota trazem personalidade sem pesar o ambiente."
      ],
      es: [
        "En Orlando, muchos clientes eligen blanco calido, greige suave y tonos tierra discretos.",
        "Estos colores aprovechan la luz natural y mantienen una sensacion elegante y acogedora.",
        "Paredes de acento en oliva o arcilla agregan personalidad sin sobrecargar el espacio."
      ]
    }
  },
  {
    slug: "how-much-does-house-painting-cost-in-orlando",
    category: "Home Improvement",
    publishedAt: "2026-03-30T09:00:00.000Z",
    title: {
      en: "How Much Does House Painting Cost in Orlando?",
      pt: "Quanto Custa Pintar uma Casa em Orlando?",
      es: "Cuanto Cuesta Pintar una Casa en Orlando?"
    },
    excerpt: {
      en: "A practical cost breakdown based on project size, prep complexity and finish level.",
      pt: "Um guia pratico de custo com base no tamanho, preparacao e nivel de acabamento.",
      es: "Una guia practica de costos segun tamano, preparacion y nivel de acabado."
    },
    content: {
      en: [
        "Painting cost varies mostly by surface condition, square footage and paint quality.",
        "Detailed prep usually delivers better long-term value than a cheaper, rushed job.",
        "Requesting an on-site estimate is the fastest way to get accurate pricing and timeline."
      ],
      pt: [
        "O custo depende principalmente do estado da superficie, metragem e tipo de tinta escolhida.",
        "Uma boa preparacao normalmente gera melhor custo-beneficio no longo prazo.",
        "A visita tecnica no local e o caminho mais rapido para obter prazo e valor realistas."
      ],
      es: [
        "El costo depende principalmente del estado de la superficie, metraje y calidad de pintura.",
        "Una buena preparacion suele dar mejor costo-beneficio a largo plazo.",
        "La visita tecnica en sitio es la forma mas rapida de obtener precio y plazo reales."
      ]
    }
  }
];

export function listBlogPosts(locale: BlogLocale): BlogPost[] {
  return BLOG_POSTS
    .map((post) => ({
      slug: post.slug,
      category: post.category,
      publishedAt: post.publishedAt,
      title: post.title[locale],
      excerpt: post.excerpt[locale],
      content: post.content[locale]
    }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function findBlogPostBySlug(slug: string, locale: BlogLocale): BlogPost | null {
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);

  if (!post) {
    return null;
  }

  return {
    slug: post.slug,
    category: post.category,
    publishedAt: post.publishedAt,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    content: post.content[locale]
  };
}

export function listBlogPostSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}
