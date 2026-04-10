"use client";

import { useMemo, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { GalleryAlbum, GalleryCategory, GalleryItem } from "@/modules/gallery/services/gallery-storage.service";

type GalleryContentResponse = {
  data: {
    categories: GalleryCategory[];
    albums: GalleryAlbum[];
    items: GalleryItem[];
  };
};

type UploadResponse = {
  data: GalleryItem[];
  meta: {
    uploaded: number;
  };
};

export function AdminGalleryManager({ initialContent }: { initialContent: GalleryContentResponse["data"] }) {
  const { t } = useAdminI18n();
  const [categories, setCategories] = useState(initialContent.categories);
  const [albums, setAlbums] = useState(initialContent.albums);
  const [items, setItems] = useState(initialContent.items);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", editingId: "" });
  const [albumForm, setAlbumForm] = useState({ name: "", slug: "", categoryId: "", isPublished: true, editingId: "" });
  const [itemForm, setItemForm] = useState({
    title: "",
    service: "",
    location: "",
    imageUrl: "",
    categoryId: "",
    albumId: "",
    isPublished: true,
    editingId: ""
  });
  const [uploadForm, setUploadForm] = useState({ categoryId: "", albumId: "", service: "", location: "", files: [] as File[] });

  const albumsByCategory = useMemo(() => {
    return albums.reduce<Record<string, GalleryAlbum[]>>((acc, album) => {
      if (!acc[album.categoryId]) {
        acc[album.categoryId] = [];
      }
      acc[album.categoryId]?.push(album);
      return acc;
    }, {});
  }, [albums]);

  const filteredAlbumsForItem = useMemo(() => {
    if (!itemForm.categoryId) {
      return albums;
    }

    return albums.filter((album) => album.categoryId === itemForm.categoryId);
  }, [albums, itemForm.categoryId]);

  const filteredAlbumsForUpload = useMemo(() => {
    if (!uploadForm.categoryId) {
      return albums;
    }

    return albums.filter((album) => album.categoryId === uploadForm.categoryId);
  }, [albums, uploadForm.categoryId]);

  async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.message ?? "Request failed");
    }

    return json as T;
  }

  async function createOrUpdateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const editing = Boolean(categoryForm.editingId);
      const payload = { name: categoryForm.name.trim(), slug: categoryForm.slug.trim() };
      const json = await requestJson<{ data: GalleryCategory }>(
        editing ? `/api/admin/gallery/categories/${categoryForm.editingId}` : "/api/admin/gallery/categories",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      setCategories((current) =>
        editing
          ? current.map((entry) => (entry.id === json.data.id ? json.data : entry))
          : [json.data, ...current]
      );
      setCategoryForm({ name: "", slug: "", editingId: "" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save category");
    }
  }

  async function deleteCategory(id: string) {
    setErrorMessage(null);

    try {
      await requestJson(`/api/admin/gallery/categories/${id}`, { method: "DELETE" });
      setCategories((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not delete category");
    }
  }

  async function createOrUpdateAlbum(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const editing = Boolean(albumForm.editingId);
      const payload = {
        name: albumForm.name.trim(),
        slug: albumForm.slug.trim(),
        categoryId: albumForm.categoryId,
        isPublished: albumForm.isPublished
      };

      const json = await requestJson<{ data: GalleryAlbum }>(editing ? `/api/admin/gallery/albums/${albumForm.editingId}` : "/api/admin/gallery/albums", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setAlbums((current) =>
        editing
          ? current.map((entry) => (entry.id === json.data.id ? json.data : entry))
          : [json.data, ...current]
      );

      setAlbumForm({ name: "", slug: "", categoryId: "", isPublished: true, editingId: "" });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save album");
    }
  }

  async function deleteAlbum(id: string) {
    setErrorMessage(null);

    try {
      await requestJson(`/api/admin/gallery/albums/${id}`, { method: "DELETE" });
      setAlbums((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not delete album");
    }
  }

  async function createOrUpdateItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const editing = Boolean(itemForm.editingId);
      const payload = {
        title: itemForm.title.trim(),
        service: itemForm.service.trim(),
        location: itemForm.location.trim(),
        imageUrl: itemForm.imageUrl.trim(),
        categoryId: itemForm.categoryId,
        albumId: itemForm.albumId,
        isPublished: itemForm.isPublished
      };

      const json = await requestJson<{ data: GalleryItem }>(editing ? `/api/admin/gallery/items/${itemForm.editingId}` : "/api/admin/gallery/items", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setItems((current) =>
        editing
          ? current.map((entry) => (entry.id === json.data.id ? json.data : entry))
          : [json.data, ...current]
      );

      setItemForm({
        title: "",
        service: "",
        location: "",
        imageUrl: "",
        categoryId: "",
        albumId: "",
        isPublished: true,
        editingId: ""
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not save gallery item");
    }
  }

  async function deleteItem(id: string) {
    setErrorMessage(null);

    try {
      await requestJson(`/api/admin/gallery/items/${id}`, { method: "DELETE" });
      setItems((current) => current.filter((entry) => entry.id !== id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not delete gallery item");
    }
  }

  async function uploadBulkFiles(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("categoryId", uploadForm.categoryId);
      formData.append("albumId", uploadForm.albumId);
      formData.append("service", uploadForm.service.trim());
      formData.append("location", uploadForm.location.trim());
      uploadForm.files.forEach((file) => formData.append("files", file));

      const json = await requestJson<UploadResponse>("/api/admin/gallery/uploads", {
        method: "POST",
        body: formData
      });

      setItems((current) => [...json.data, ...current]);
      setUploadForm({ categoryId: "", albumId: "", service: "", location: "", files: [] });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Bulk upload failed");
    }
  }

  return (
    <div className="grid gap-6">
      {errorMessage ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{errorMessage}</p> : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{t("gallery.categories")}</h2>
        <form onSubmit={createOrUpdateCategory} className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <input value={categoryForm.name} onChange={(event) => setCategoryForm((c) => ({ ...c, name: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.categoryNamePlaceholder")} />
          <input value={categoryForm.slug} onChange={(event) => setCategoryForm((c) => ({ ...c, slug: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Slug (ex: residential)" />
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">{categoryForm.editingId ? t("gallery.save") : t("gallery.add")}</button>
        </form>
        <ul className="mt-4 grid gap-2">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{category.name}</p>
                <p className="text-xs text-slate-500">{category.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCategoryForm({ name: category.name, slug: category.slug, editingId: category.id })} className="rounded-lg border border-slate-300 px-3 py-1 text-xs">{t("common.edit")}</button>
                <button type="button" onClick={() => deleteCategory(category.id)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-700">{t("common.delete")}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{t("gallery.albums")}</h2>
        <form onSubmit={createOrUpdateAlbum} className="mt-4 grid gap-2 md:grid-cols-2">
          <input value={albumForm.name} onChange={(event) => setAlbumForm((c) => ({ ...c, name: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.albumNamePlaceholder")} />
          <input value={albumForm.slug} onChange={(event) => setAlbumForm((c) => ({ ...c, slug: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder="Slug do album" />
          <select value={albumForm.categoryId} onChange={(event) => setAlbumForm((c) => ({ ...c, categoryId: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">{t("gallery.selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <input type="checkbox" checked={albumForm.isPublished} onChange={(event) => setAlbumForm((c) => ({ ...c, isPublished: event.target.checked }))} />
            {t("gallery.published")}
          </label>
          <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white md:col-span-2 w-fit">{albumForm.editingId ? t("gallery.save") : t("gallery.add")}</button>
        </form>
        <ul className="mt-4 grid gap-2">
          {albums.map((album) => (
            <li key={album.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{album.name}</p>
                <p className="text-xs text-slate-500">{album.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setAlbumForm({ name: album.name, slug: album.slug, categoryId: album.categoryId, isPublished: album.isPublished, editingId: album.id })} className="rounded-lg border border-slate-300 px-3 py-1 text-xs">{t("common.edit")}</button>
                <button type="button" onClick={() => deleteAlbum(album.id)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-700">{t("common.delete")}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{t("gallery.bulkUpload")}</h2>
        <form onSubmit={uploadBulkFiles} className="mt-4 grid gap-2 md:grid-cols-2">
          <select value={uploadForm.categoryId} onChange={(event) => setUploadForm((c) => ({ ...c, categoryId: event.target.value, albumId: "" }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">{t("gallery.selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select value={uploadForm.albumId} onChange={(event) => setUploadForm((c) => ({ ...c, albumId: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">{t("gallery.selectAlbum")}</option>
            {filteredAlbumsForUpload.map((album) => (
              <option key={album.id} value={album.id}>{album.name}</option>
            ))}
          </select>
          <input value={uploadForm.service} onChange={(event) => setUploadForm((c) => ({ ...c, service: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.uploadServicePlaceholder")} />
          <input value={uploadForm.location} onChange={(event) => setUploadForm((c) => ({ ...c, location: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.uploadLocationPlaceholder")} />
          <input type="file" multiple accept="image/*" onChange={(event) => setUploadForm((c) => ({ ...c, files: Array.from(event.target.files ?? []) }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2" />
          <button type="submit" className="w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">{t("gallery.bulkUploadAction")}</button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{t("gallery.items")}</h2>
        <form onSubmit={createOrUpdateItem} className="mt-4 grid gap-2 md:grid-cols-2">
          <input value={itemForm.title} onChange={(event) => setItemForm((c) => ({ ...c, title: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.itemTitlePlaceholder")} />
          <input value={itemForm.service} onChange={(event) => setItemForm((c) => ({ ...c, service: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.itemServicePlaceholder")} />
          <input value={itemForm.location} onChange={(event) => setItemForm((c) => ({ ...c, location: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.itemLocationPlaceholder")} />
          <input value={itemForm.imageUrl} onChange={(event) => setItemForm((c) => ({ ...c, imageUrl: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" placeholder={t("gallery.itemImageUrlPlaceholder")} />
          <select value={itemForm.categoryId} onChange={(event) => setItemForm((c) => ({ ...c, categoryId: event.target.value, albumId: "" }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">{t("gallery.selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select value={itemForm.albumId} onChange={(event) => setItemForm((c) => ({ ...c, albumId: event.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">{t("gallery.selectAlbum")}</option>
            {filteredAlbumsForItem.map((album) => (
              <option key={album.id} value={album.id}>{album.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm md:col-span-2">
            <input type="checkbox" checked={itemForm.isPublished} onChange={(event) => setItemForm((c) => ({ ...c, isPublished: event.target.checked }))} />
            {t("gallery.published")}
          </label>
          <button type="submit" className="w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">{itemForm.editingId ? t("gallery.save") : t("gallery.add")}</button>
        </form>

        <ul className="mt-4 grid gap-2">
          {items.map((item) => {
            const category = categories.find((entry) => entry.id === item.categoryId);
            const album = albums.find((entry) => entry.id === item.albumId);

            return (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.service} · {item.location}</p>
                  <p className="text-xs text-slate-500">{category?.name ?? "-"} / {album?.name ?? "-"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setItemForm({
                      title: item.title,
                      service: item.service,
                      location: item.location,
                      imageUrl: item.imageUrl,
                      categoryId: item.categoryId,
                      albumId: item.albumId,
                      isPublished: item.isPublished,
                      editingId: item.id
                    })}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs"
                  >
                    {t("common.edit")}
                  </button>
                  <button type="button" onClick={() => deleteItem(item.id)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-700">{t("common.delete")}</button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{t("gallery.summary")}</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{t("gallery.categoriesCount")}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{categories.length}</p>
          </article>
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{t("gallery.albumsCount")}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{albums.length}</p>
          </article>
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">{t("gallery.projectsCount")}</p>
            <p className="mt-2 text-2xl font-black text-slate-900">{items.length}</p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-black tracking-tight text-slate-900">{t("gallery.albumsByCategory")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {categories.map((category) => (
            <article key={category.id} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-bold text-slate-900">{category.name}</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {(albumsByCategory[category.id] ?? []).map((album) => (
                  <li key={album.id}>{album.name}</li>
                ))}
                {(albumsByCategory[category.id] ?? []).length === 0 ? <li className="text-xs text-slate-500">{t("gallery.noAlbums")}</li> : null}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
