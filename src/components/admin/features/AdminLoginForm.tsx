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
    <section className="mx-auto flex min-h-screen w-full max-w-sm items-center px-4 py-10">
      <div className="w-full">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/logo/logomcs.png"
            alt="Master Coat Solutions"
            className="h-16 w-auto"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
          <h1 className="text-center text-xl font-bold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-center text-xs text-slate-400">Admin Panel</p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit} aria-label="admin-login-form">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-slate-600">{emailLabel}</label>
              <input
                id="login-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-slate-600">{passwordLabel}</label>
              <input
                id="login-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : submitLabel}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          Secured by Innexar
        </p>
      </div>
    </section>
  );
}
