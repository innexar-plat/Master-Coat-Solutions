type ContactPanelProps = {
  title: string;
  description: string;
  phone: string;
  email: string;
  address: string;
};

export function ContactPanel({ title, description, phone, email, address }: ContactPanelProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10 md:px-6">
      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.6)] md:grid-cols-2 md:p-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
          <p className="mt-3 text-slate-600">{description}</p>
        </div>
        <dl className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3 md:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55)]">
            <dt className="font-semibold text-slate-900">Phone</dt>
            <dd>{phone}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55)]">
            <dt className="font-semibold text-slate-900">Email</dt>
            <dd>{email}</dd>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.55)]">
            <dt className="font-semibold text-slate-900">Address</dt>
            <dd>{address}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
