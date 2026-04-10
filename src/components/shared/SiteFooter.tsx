import { Link } from "@/i18n/navigation";
import { readSocialLinksSettings } from "@/modules/settings/services/social-links-settings.service";

type SiteFooterProps = {
  locale: string;
};

const SOCIAL_ITEMS = [
  { key: "facebookUrl", label: "Facebook" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "linkedinUrl", label: "LinkedIn" },
  { key: "youtubeUrl", label: "YouTube" },
  { key: "tiktokUrl", label: "TikTok" },
  { key: "xUrl", label: "X" }
] as const;

export async function SiteFooter({ locale }: SiteFooterProps) {
  const settings = await readSocialLinksSettings();

  const socialLinks = SOCIAL_ITEMS.filter((item) => {
    const value = settings[item.key];
    return Boolean(value && value.trim());
  }).map((item) => ({
    label: item.label,
    href: settings[item.key] as string
  }));

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-theme bg-theme-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr] md:px-6">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-theme-primary-strong">Master Coat Solutions</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-theme-secondary">Premium Residential Painting</h2>
          <p className="mt-3 max-w-md text-sm text-theme-soft">
            Interior, exterior, and detail finishes delivered with clear communication and professional craftsmanship.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-theme-secondary">Quick Links</h3>
          <nav className="mt-3 grid gap-2 text-sm text-theme-soft" aria-label="Footer links">
            <Link href="/" locale={locale as "en" | "pt" | "es"} className="hover:text-theme-secondary">Home</Link>
            <Link href="/services" locale={locale as "en" | "pt" | "es"} className="hover:text-theme-secondary">Services</Link>
            <Link href="/gallery" locale={locale as "en" | "pt" | "es"} className="hover:text-theme-secondary">Gallery</Link>
            <Link href="/blog" locale={locale as "en" | "pt" | "es"} className="hover:text-theme-secondary">Blog</Link>
            <Link href="/contact" locale={locale as "en" | "pt" | "es"} className="hover:text-theme-secondary">Contact</Link>
          </nav>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-theme-secondary">Follow Us</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {socialLinks.length === 0 ? (
              <p className="text-sm text-theme-soft">Social links will appear here after setup in admin.</p>
            ) : (
              socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-theme px-3 py-1.5 text-xs font-semibold text-theme-secondary transition hover:bg-theme-surface-soft"
                >
                  {item.label}
                </a>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="border-t border-theme bg-theme-surface-soft">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-theme-soft md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {year} Master Coat Solutions. All rights reserved.</p>
          <p>
            Built by{" "}
            <a
              href="https://innexar.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-theme-secondary hover:text-theme-primary-strong"
            >
              Innexar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
