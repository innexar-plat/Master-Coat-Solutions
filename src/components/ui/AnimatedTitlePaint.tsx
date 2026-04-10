import React from "react";

type AnimatedTitlePaintProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function AnimatedTitlePaint({
  title,
  subtitle,
  align = "left",
  className,
}: AnimatedTitlePaintProps) {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignment} ${className ?? ""}`.trim()}>
      <h1 className="paint-title text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h1>
      {subtitle ? (
        <p className="max-w-2xl text-base text-theme-soft md:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}
