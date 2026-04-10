"use client";

import { useState } from "react";

type AdminLoginFormProps = {
  title: string;
  submitLabel: string;
  emailLabel: string;
  passwordLabel: string;
  errorLabel: string;
};

export function AdminLoginForm({
  title,
  submitLabel,
  emailLabel,
  passwordLabel,
  errorLabel
}: AdminLoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      window.location.href = "/admin";
    } catch {
      setError(errorLabel);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-card md:p-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit} aria-label="admin-login-form">
          <input
            name="email"
            type="email"
            required
            placeholder={emailLabel}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            placeholder={passwordLabel}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "..." : submitLabel}
          </button>
          {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
