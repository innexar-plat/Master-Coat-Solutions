import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type ServiceShowcaseCardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  ctaLabel?: string;
  href?: string;
  locale?: string;
};

export function ServiceShowcaseCard({
  title,
  description,
  imageUrl,
  ctaLabel = "Get Free Estimate",
  href,
  locale,
}: ServiceShowcaseCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-theme bg-theme-surface shadow-[0_18px_36px_-26px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_44px_-24px_rgba(15,23,42,0.65)]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-transparent to-slate-100/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {imageUrl ? (
        <div className="h-44 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            width={640}
            height={360}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="relative flex flex-col gap-3 p-5">
        <h3 className="text-xl font-bold text-theme-secondary">{title}</h3>
        <p className="text-sm leading-relaxed text-theme-soft">{description}</p>
        {href ? (
          <Link
            href={href}
            locale={locale}
            className="inline-flex w-fit items-center rounded-full bg-theme-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-theme-primary-strong"
          >
            {ctaLabel}
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex w-fit items-center rounded-full bg-theme-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-theme-primary-strong"
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </article>
  );
}
