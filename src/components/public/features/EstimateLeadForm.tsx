"use client";

import { useState } from "react";
import { trackAnalyticsEvent } from "@/modules/analytics/services/track-analytics.client";

type EstimateLeadFormProps = {
  ctaLabel: string;
  locale: "en" | "pt" | "es";
  placeholders: {
    name: string;
    phone: string;
    email: string;
    service: string;
    details: string;
  };
  feedback: {
    success: string;
    error: string;
  };
};

export function EstimateLeadForm({ ctaLabel, locale, placeholders, feedback }: EstimateLeadFormProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      service: String(formData.get("service") ?? ""),
      message: String(formData.get("message") ?? ""),
      locale,
      source: "free-estimate"
    };

    try {
      setStatus("loading");

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      void trackAnalyticsEvent({
        eventName: "LEAD_SUBMIT",
        pagePath: window.location.pathname,
        locale,
        source: "estimate-form",
        metadata: {
          formSource: "free-estimate"
        }
      });

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="mt-6 grid gap-4 md:grid-cols-2" aria-label="estimate-form" onSubmit={handleSubmit}>
      <input name="name" required className="rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder={placeholders.name} />
      <input name="phone" required className="rounded-xl border border-slate-300 px-4 py-3 text-sm" placeholder={placeholders.phone} />
      <input name="email" type="email" className="rounded-xl border border-slate-300 px-4 py-3 text-sm md:col-span-2" placeholder={placeholders.email} />
      <input name="service" required className="rounded-xl border border-slate-300 px-4 py-3 text-sm md:col-span-2" placeholder={placeholders.service} />
      <textarea name="message" className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 text-sm md:col-span-2" placeholder={placeholders.details} />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
      >
        {status === "loading" ? "..." : ctaLabel}
      </button>
      {status === "success" ? <p className="text-sm font-medium text-emerald-700 md:col-span-2">{feedback.success}</p> : null}
      {status === "error" ? <p className="text-sm font-medium text-red-700 md:col-span-2">{feedback.error}</p> : null}
    </form>
  );
}
