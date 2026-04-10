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
    <form aria-label="pixel-manager-form" onSubmit={handleSave} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 md:p-6">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(event) => setSettings((current) => ({ ...current, enabled: event.target.checked }))}
        />
        {t("pixels.enable")}
      </label>

      <input
        value={settings.ga4MeasurementId}
        onChange={(event) => setSettings((current) => ({ ...current, ga4MeasurementId: event.target.value }))}
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="GA4 Measurement ID (G-XXXX)"
      />
      <input
        value={settings.gtmId}
        onChange={(event) => setSettings((current) => ({ ...current, gtmId: event.target.value }))}
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="GTM Container ID (GTM-XXXX)"
      />
      <input
        value={settings.metaPixelId}
        onChange={(event) => setSettings((current) => ({ ...current, metaPixelId: event.target.value }))}
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="Meta Pixel ID"
      />
      <input
        value={settings.googleAdsId}
        onChange={(event) => setSettings((current) => ({ ...current, googleAdsId: event.target.value }))}
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="Google Ads ID (AW-XXXX)"
      />
      <input
        value={settings.tiktokPixelId}
        onChange={(event) => setSettings((current) => ({ ...current, tiktokPixelId: event.target.value }))}
        className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
        placeholder="TikTok Pixel ID"
      />

      <button
        type="submit"
        disabled={status === "saving"}
        className="inline-flex w-fit rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-70"
      >
        {status === "saving" ? t("pending.saving") : t("pixels.save")}
      </button>

      {status === "saved" ? <p className="text-sm font-medium text-emerald-700">{t("pixels.saved")}</p> : null}
    </form>
  );
}
