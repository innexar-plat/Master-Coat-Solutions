import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { GalleryProjectGrid } from "@/components/public/features/GalleryProjectGrid";
import { listPublicGalleryItems } from "@/modules/gallery/services/gallery-storage.service";

export default async function GalleryPage() {
  const t = await getTranslations("Pages");
  const storedItems = await listPublicGalleryItems();

  const fallbackProjects = [
    { title: t("galleryProjectOne"), location: "Orlando", service: "Interior Painting" },
    { title: t("galleryProjectTwo"), location: "Winter Park", service: "Exterior Painting" },
    { title: t("galleryProjectThree"), location: "Kissimmee", service: "Trim and Detail" }
  ];

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
      : fallbackProjects;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro eyebrow={t("eyebrow")} title={t("galleryTitle")} description={t("galleryDescription")} />
      <GalleryProjectGrid
        title={t("galleryGridTitle")}
        projects={projects}
      />
    </main>
  );
}
