import { EstimateLeadForm } from "@/components/public/features/EstimateLeadForm";

type EstimateFormPreviewProps = {
  title: string;
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

export function EstimateFormPreview({ title, ctaLabel, locale, placeholders, feedback }: EstimateFormPreviewProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
        <EstimateLeadForm ctaLabel={ctaLabel} locale={locale} placeholders={placeholders} feedback={feedback} />
      </div>
    </section>
  );
}
