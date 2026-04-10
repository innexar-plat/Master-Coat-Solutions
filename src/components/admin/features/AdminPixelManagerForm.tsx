"use client";

import { useEffect, useState } from "react";
import { useAdminI18n } from "@/components/admin/layout/AdminI18nProvider";
import type { PixelSettings } from "@/modules/pixels/dtos/pixel-settings.dto";

const EMPTY_SETTINGS: PixelSettings = {
  enabled: false,
  ga4MeasurementId: "",
  gtmId: "",
  metaPixelId: "",
  googleAdsId: "",
  tiktokPixelId: ""
};

export function AdminPixelManagerForm() {
  const { t } = useAdminI18n();
  const [settings, setSettings] = useState<PixelSettings>(EMPTY_SETTINGS);
  const [status, setStatus] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/pixels");
        if (!response.ok) {
          throw new Error("Failed to load pixel settings");
        }

        const json = (await response.json()) as { data: PixelSettings };
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

    const response = await fetch("/api/admin/pixels", {
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
    return <p className="text-sm text-slate-600">{t("pixels.loading")}</p>;
  }

  if (status === "error") {
    return <p className="text-sm font-medium text-red-700">{t("pixels.error")}</p>;
  }

  return (
    <form aria-label="pixel-manager-form" onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-3.5">
        <h2 className="text-base font-bold text-slate-900">Tracking Pixels</h2>
        <p className="mt-0.5 text-xs text-slate-500">Configure your analytics and advertising pixels</p>
      </div>

      <div className="grid gap-4 px-5 py-4">
        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(event) => setSettings((current) => ({ ...current, enabled: event.target.checked }))}
            className="h-4 w-4 rounded border-slate-300"
          />
          {t("pixels.enable")}
        </label>

        <div>
          <label htmlFor="px-ga4" className="mb-1 block text-xs font-medium text-slate-600">GA4 Measurement ID</label>
          <input
            id="px-ga4"
            value={settings.ga4MeasurementId}
            onChange={(event) => setSettings((current) => ({ ...current, ga4MeasurementId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="G-XXXXXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="px-gtm" className="mb-1 block text-xs font-medium text-slate-600">GTM Container ID</label>
          <input
            id="px-gtm"
            value={settings.gtmId}
            onChange={(event) => setSettings((current) => ({ ...current, gtmId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="GTM-XXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="px-meta" className="mb-1 block text-xs font-medium text-slate-600">Meta Pixel ID</label>
          <input
            id="px-meta"
            value={settings.metaPixelId}
            onChange={(event) => setSettings((current) => ({ ...current, metaPixelId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="000000000000000"
          />
        </div>
        <div>
          <label htmlFor="px-gads" className="mb-1 block text-xs font-medium text-slate-600">Google Ads ID</label>
          <input
            id="px-gads"
            value={settings.googleAdsId}
            onChange={(event) => setSettings((current) => ({ ...current, googleAdsId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="AW-XXXXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="px-tt" className="mb-1 block text-xs font-medium text-slate-600">TikTok Pixel ID</label>
          <input
            id="px-tt"
            value={settings.tiktokPixelId}
            onChange={(event) => setSettings((current) => ({ ...current, tiktokPixelId: event.target.value }))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="XXXXXXXXXXXXXXX"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-3.5">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {status === "saving" ? t("pending.saving") : t("pixels.save")}
        </button>

        {status === "saved" ? (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
            <span>✓</span> {t("pixels.saved")}
          </span>
        ) : null}
      </div>
    </form>
  );
}
