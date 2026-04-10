import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { PageIntro } from "@/components/public/sections/PageIntro";
import { BlogPostGrid } from "@/components/public/features/BlogPostGrid";
import { listLocalizedBlogPosts } from "@/modules/blog/services/blog-storage.service";

type BlogPageProps = {
  params: {
    locale: "en" | "pt" | "es";
  };
};

export default async function BlogPage({ params }: BlogPageProps) {
  const t = await getTranslations("Pages");
  const posts = await listLocalizedBlogPosts(params.locale);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <PageIntro eyebrow={t("eyebrow")} title={t("blogTitle")} description={t("blogDescription")} />
      <BlogPostGrid
        title={t("blogGridTitle")}
        readMoreLabel={t("blogReadMore")}
        publishedPrefix={t("blogPublishedPrefix")}
        posts={posts}
      />
    </main>
  );
}
