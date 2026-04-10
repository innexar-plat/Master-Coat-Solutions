export type ServiceAreaLocale = "en" | "pt" | "es";

export type ServiceArea = {
  slug: string;
  city: string;
  state: string;
  summary: string;
};

type LocalizedServiceArea = {
  slug: string;
  city: string;
  state: string;
  summary: Record<ServiceAreaLocale, string>;
};

const AREAS: LocalizedServiceArea[] = [
  {
    slug: "orlando",
    city: "Orlando",
    state: "FL",
    summary: {
      en: "Premium interior and exterior painting for homes and businesses across Orlando.",
      pt: "Pintura interna e externa premium para casas e negocios em Orlando.",
      es: "Pintura interior y exterior premium para hogares y negocios en Orlando."
    }
  },
  {
    slug: "winter-park",
    city: "Winter Park",
    state: "FL",
    summary: {
      en: "Detail-focused painting with premium prep standards for Winter Park properties.",
      pt: "Pintura com foco em detalhes e preparacao premium para imoveis em Winter Park.",
      es: "Pintura con foco en detalles y preparacion premium para propiedades en Winter Park."
    }
  },
  {
    slug: "kissimmee",
    city: "Kissimmee",
    state: "FL",
    summary: {
      en: "Reliable repaint projects for family homes and rental properties in Kissimmee.",
      pt: "Projetos de repintura confiaveis para residencias e imoveis de aluguel em Kissimmee.",
      es: "Proyectos de repintado confiables para residencias e inmuebles de renta en Kissimmee."
    }
  },
  {
    slug: "altamonte-springs",
    city: "Altamonte Springs",
    state: "FL",
    summary: {
      en: "Clean execution and durable finishes designed for Florida weather in Altamonte Springs.",
      pt: "Execucao limpa e acabamentos duraveis para o clima da Florida em Altamonte Springs.",
      es: "Ejecucion limpia y acabados duraderos para el clima de Florida en Altamonte Springs."
    }
  },
  {
    slug: "lake-mary",
    city: "Lake Mary",
    state: "FL",
    summary: {
      en: "High-end repainting solutions for modern homes and offices in Lake Mary.",
      pt: "Solucoes de repintura de alto nivel para casas e escritorios em Lake Mary.",
      es: "Soluciones de repintado de alto nivel para casas y oficinas en Lake Mary."
    }
  }
];

export function listServiceAreas(locale: ServiceAreaLocale): ServiceArea[] {
  return AREAS.map((area) => ({
    slug: area.slug,
    city: area.city,
    state: area.state,
    summary: area.summary[locale]
  }));
}

export function findServiceAreaBySlug(slug: string, locale: ServiceAreaLocale): ServiceArea | null {
  const area = AREAS.find((entry) => entry.slug === slug);

  if (!area) {
    return null;
  }

  return {
    slug: area.slug,
    city: area.city,
    state: area.state,
    summary: area.summary[locale]
  };
}

export function listServiceAreaSlugs(): string[] {
  return AREAS.map((area) => area.slug);
}
