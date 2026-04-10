"use client";

import { useState } from "react";
import { trackAnalyticsEvent } from "@/modules/analytics/services/track-analytics.client";

type Locale = "en" | "pt" | "es";

type ServiceOption = {
  value: string;
  label: string;
};

type HomeLeadCaptureFormProps = {
  locale: Locale;
  title: string;
  description: string;
  ctaLabel: string;
  placeholders: {
    name: string;
    phone: string;
    email: string;
    details: string;
  };
  serviceTypeLabel: string;
  serviceTypePlaceholder: string;
  serviceOptions: ServiceOption[];
  feedback: {
    success: string;
    error: string;
  };
  validation: {
    nameRequired: string;
    phoneInvalid: string;
    emailInvalid: string;
    serviceRequired: string;
  };
};

type FormValues = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
};

function maskPhone(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, "").slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function isValidEmail(value: string): boolean {
  if (!value.trim()) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function HomeLeadCaptureForm({
  locale,
  title,
  description,
  ctaLabel,
  placeholders,
  serviceTypeLabel,
  serviceTypePlaceholder,
  serviceOptions,
  feedback,
  validation
}: HomeLeadCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [values, setValues] = useState<FormValues>({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: ""
  });
  const [touched, setTouched] = useState<Record<keyof FormValues, boolean>>({
    name: false,
    phone: false,
    email: false,
    service: false,
    message: false
  });

  const phoneDigits = values.phone.replace(/\D/g, "");
  const errors = {
    name: values.name.trim().length < 2 ? validation.nameRequired : "",
    phone: phoneDigits.length < 10 ? validation.phoneInvalid : "",
    email: !isValidEmail(values.email) ? validation.emailInvalid : "",
    service: values.service.trim().length === 0 ? validation.serviceRequired : "",
    message: ""
  };
  const isFormValid = !errors.name && !errors.phone && !errors.email && !errors.service;

  function setFieldValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (status !== "idle") {
      setStatus("idle");
    }
  }

  function markTouched(field: keyof FormValues) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid) {
      setTouched({ name: true, phone: true, email: true, service: true, message: true });
      setStatus("error");
      return;
    }

    const payload = {
      name: values.name.trim(),
      phone: phoneDigits,
      email: values.email.trim(),
      service: values.service,
      message: values.message.trim(),
      locale,
      source: "contact"
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
        source: "home-contact-form",
        metadata: {
          formSource: "home-contact",
          serviceType: payload.service
        }
      });

      setValues({ name: "", phone: "", email: "", service: "", message: "" });
      setTouched({ name: false, phone: false, email: false, service: false, message: false });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-4 pb-24 md:px-6">
      <div className="rounded-3xl border border-theme bg-theme-surface p-6 shadow-card md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-theme-primary">{serviceTypeLabel}</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-theme-secondary md:text-4xl">{title}</h2>
        <p className="mt-3 text-theme-soft">{description}</p>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            name="name"
            required
            value={values.name}
            onChange={(event) => setFieldValue("name", event.target.value)}
            onBlur={() => markTouched("name")}
            aria-invalid={Boolean(touched.name && errors.name)}
            className={`rounded-xl border bg-white px-4 py-3 text-sm ${
              touched.name && errors.name ? "border-red-400" : "border-theme"
            }`}
            placeholder={placeholders.name}
          />
          <input
            name="phone"
            required
            value={values.phone}
            onChange={(event) => setFieldValue("phone", maskPhone(event.target.value))}
            onBlur={() => markTouched("phone")}
            inputMode="tel"
            aria-invalid={Boolean(touched.phone && errors.phone)}
            className={`rounded-xl border bg-white px-4 py-3 text-sm ${
              touched.phone && errors.phone ? "border-red-400" : "border-theme"
            }`}
            placeholder={placeholders.phone}
          />
          {touched.name && errors.name ? <p className="text-xs font-medium text-red-700 md:col-span-1">{errors.name}</p> : <span />}
          {touched.phone && errors.phone ? <p className="text-xs font-medium text-red-700 md:col-span-1">{errors.phone}</p> : <span />}
          <input
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => setFieldValue("email", event.target.value)}
            onBlur={() => markTouched("email")}
            aria-invalid={Boolean(touched.email && errors.email)}
            className={`rounded-xl border bg-white px-4 py-3 text-sm md:col-span-2 ${
              touched.email && errors.email ? "border-red-400" : "border-theme"
            }`}
            placeholder={placeholders.email}
          />
          {touched.email && errors.email ? <p className="text-xs font-medium text-red-700 md:col-span-2">{errors.email}</p> : null}
          <select
            name="service"
            required
            value={values.service}
            onChange={(event) => setFieldValue("service", event.target.value)}
            onBlur={() => markTouched("service")}
            aria-invalid={Boolean(touched.service && errors.service)}
            className={`rounded-xl border bg-white px-4 py-3 text-sm md:col-span-2 ${
              touched.service && errors.service ? "border-red-400" : "border-theme"
            }`}
            aria-label={serviceTypeLabel}
          >
            <option value="" disabled>
              {serviceTypePlaceholder}
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {touched.service && errors.service ? <p className="text-xs font-medium text-red-700 md:col-span-2">{errors.service}</p> : null}
          <textarea
            name="message"
            value={values.message}
            onChange={(event) => setFieldValue("message", event.target.value)}
            onBlur={() => markTouched("message")}
            className="min-h-28 rounded-xl border border-theme bg-white px-4 py-3 text-sm md:col-span-2"
            placeholder={placeholders.details}
          />
          <button
            type="submit"
            disabled={status === "loading" || !isFormValid}
            className="rounded-2xl bg-theme-secondary px-6 py-4 text-base font-extrabold uppercase tracking-wide text-white transition hover:bg-theme-primary disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
          >
            {status === "loading" ? "..." : ctaLabel}
          </button>
          {status === "success" ? <p className="text-sm font-semibold text-emerald-700 md:col-span-2">{feedback.success}</p> : null}
          {status === "error" ? <p className="text-sm font-semibold text-red-700 md:col-span-2">{feedback.error}</p> : null}
        </form>
      </div>
    </section>
  );
}
