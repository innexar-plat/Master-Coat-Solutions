"use client";

type MobileStickyCtaProps = {
  label: string;
};

export function MobileStickyCta({ label }: MobileStickyCtaProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 md:hidden">
      <button
        type="button"
        className="w-full rounded-full bg-theme-primary px-5 py-3 text-sm font-bold text-white shadow-card transition hover:bg-theme-primary-strong"
      >
        {label}
      </button>
    </div>
  );
}
