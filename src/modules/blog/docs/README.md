# Blog Module

## Scope
Provides localized blog content for public SEO pages and admin-side post management.

## Components
- Storage service: src/modules/blog/services/blog-storage.service.ts
- Admin DTO: src/modules/blog/dtos/manage-blog-post.dto.ts
- Blog listing page: src/app/[locale]/blog/page.tsx
- Blog detail page: src/app/[locale]/blog/[slug]/page.tsx
- Admin blog API: src/app/api/admin/blog/route.ts
- Admin blog delete API: src/app/api/admin/blog/[slug]/route.ts
- Admin manager page: src/app/(admin)/admin/blog/page.tsx
- Admin manager UI: src/components/admin/features/AdminBlogManager.tsx
- Listing UI: src/components/public/features/BlogPostGrid.tsx
- Article UI: src/components/public/features/BlogPostArticle.tsx

## Tests
- src/modules/blog/tests/blog-posts.data.test.ts
- src/modules/blog/tests/manage-blog-post.dto.test.ts
- src/modules/blog/tests/blog-storage.service.test.ts
- src/app/api/admin/blog/route.test.ts
- src/app/api/admin/blog/[slug]/route.test.ts
- src/components/admin/features/AdminBlogManager.test.tsx
- src/components/public/features/BlogPostGrid.test.tsx
- src/components/public/features/BlogPostArticle.test.tsx
