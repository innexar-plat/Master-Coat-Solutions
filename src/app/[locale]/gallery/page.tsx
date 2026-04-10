import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { GalleryProjectGrid } from "@/components/public/features/GalleryProjectGrid";
import { listPublicGalleryItems, listPublicCategories } from "@/modules/gallery/services/gallery-storage.service";

export default async function GalleryPage() {
  const t = await getTranslations("Pages");
  const [storedItems, categories] = await Promise.all([
    listPublicGalleryItems(),
    listPublicCategories()
  ]);

  const projects =
    storedItems.length > 0
      ? storedItems.map((item) => ({
          title: item.title,
          location: item.location,
          service: item.service,
          categoryName: item.categoryName,
          albumName: item.albumName,
          imageUrl: item.imageUrl
        }))
      : [];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro eyebrow={t("eyebrow")} title={t("galleryTitle")} description={t("galleryDescription")} />
      <GalleryProjectGrid
        title={t("galleryGridTitle")}
        projects={projects}
        categories={categories.map((c) => c.name)}
      />
    </main>
  );
}
