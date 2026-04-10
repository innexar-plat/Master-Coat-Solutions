import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { BlogPostArticle } from "@/components/public/features/BlogPostArticle";
import { findLocalizedBlogPostBySlug } from "@/modules/blog/services/blog-storage.service";

type BlogPostPageProps = {
  params: {
    locale: "en" | "pt" | "es";
    slug: string;
  };
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const t = await getTranslations("Pages");
  const post = await findLocalizedBlogPostBySlug(params.slug, params.locale);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <BlogPostArticle
        category={post.category}
        title={post.title}
        publishedAt={post.publishedAt}
        publishedPrefix={t("blogPublishedPrefix")}
        paragraphs={post.content}
        backToListLabel={t("blogBackToList")}
      />
    </main>
  );
}
