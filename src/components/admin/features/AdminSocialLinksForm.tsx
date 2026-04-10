"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { SocialLinksSettings } from "@/modules/settings/dtos/social-links-settings.dto";

const EMPTY_SETTINGS: SocialLinksSettings = {
  facebookUrl: "",
  instagramUrl: "",
  linkedinUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
  xUrl: ""
};

export function AdminSocialLinksForm() {
  const { t } = useAdminI18n();
  const [settings, setSettings] = useState<SocialLinksSettings>(EMPTY_SETTINGS);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/settings/social-links");
        if (!response.ok) {
          throw new Error("Failed to load social links settings");
        }

        const json = (await response.json()) as { data: SocialLinksSettings };
        setSettings(json.data);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }

    loadSettings();
  }, []);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");

    const response = await fetch("/api/admin/settings/social-links", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    setStatus("saved");
  }

  if (status === "loading") {
    return <p className="text-sm text-slate-600">{t("settings.social.loading")}</p>;
  }

  if (status === "error") {
    return <p className="text-sm font-medium text-red-700">{t("settings.social.error")}</p>;
  }

  return (
    <form
      aria-label="social-links-form"
      onSubmit={handleSave}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-5 py-3.5">
        <h2 className="text-base font-bold text-slate-900">Social Links</h2>
        <p className="mt-0.5 text-xs text-slate-500">Configure your social media profile URLs</p>
      </div>

      <div className="grid gap-4 px-5 py-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sl-facebook" className="mb-1 block text-xs font-medium text-slate-600">Facebook</label>
          <input
            id="sl-facebook"
            value={settings.facebookUrl}
            onChange={(event) => setSettings((current) => ({ ...current, facebookUrl: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <label htmlFor="sl-instagram" className="mb-1 block text-xs font-medium text-slate-600">Instagram</label>
          <input
            id="sl-instagram"
            value={settings.instagramUrl}
            onChange={(event) => setSettings((current) => ({ ...current, instagramUrl: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="https://instagram.com/..."
          />
        </div>
        <div>
          <label htmlFor="sl-linkedin" className="mb-1 block text-xs font-medium text-slate-600">LinkedIn</label>
          <input
            id="sl-linkedin"
            value={settings.linkedinUrl}
            onChange={(event) => setSettings((current) => ({ ...current, linkedinUrl: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label htmlFor="sl-youtube" className="mb-1 block text-xs font-medium text-slate-600">YouTube</label>
          <input
            id="sl-youtube"
            value={settings.youtubeUrl}
            onChange={(event) => setSettings((current) => ({ ...current, youtubeUrl: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="https://youtube.com/@..."
          />
        </div>
        <div>
          <label htmlFor="sl-tiktok" className="mb-1 block text-xs font-medium text-slate-600">TikTok</label>
          <input
            id="sl-tiktok"
            value={settings.tiktokUrl}
            onChange={(event) => setSettings((current) => ({ ...current, tiktokUrl: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="https://tiktok.com/@..."
          />
        </div>
        <div>
          <label htmlFor="sl-x" className="mb-1 block text-xs font-medium text-slate-600">X (Twitter)</label>
          <input
            id="sl-x"
            value={settings.xUrl}
            onChange={(event) => setSettings((current) => ({ ...current, xUrl: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="https://x.com/..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-3.5">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {status === "saving" ? t("pending.saving") : t("settings.social.save")}
        </button>

        {status === "saved" ? (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <span>✓</span> {t("settings.social.saved")}
          </span>
        ) : null}
      </div>
    </form>
  );
}
