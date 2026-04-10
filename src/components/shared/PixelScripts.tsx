import Script from "next/script";
import { readPixelSettings } from "@/modules/pixels/services/pixel-settings.service";

export async function PixelScripts() {
  const settings = await readPixelSettings();

  if (!settings.enabled) {
    return null;
  }

  const shouldLoadGtag = Boolean(settings.ga4MeasurementId || settings.googleAdsId);

  return (
    <>
      {settings.gtmId ? (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${settings.gtmId}');`}
        </Script>
      ) : null}

      {shouldLoadGtag ? <Script src="https://www.googletagmanager.com/gtag/js" strategy="afterInteractive" /> : null}
      {shouldLoadGtag ? (
        <Script id="gtag-config" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${settings.ga4MeasurementId ? `gtag('config', '${settings.ga4MeasurementId}');` : ""}
${settings.googleAdsId ? `gtag('config', '${settings.googleAdsId}');` : ""}`}
        </Script>
      ) : null}

      {settings.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${settings.metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}

      {settings.tiktokPixelId ? (
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`window.ttq = window.ttq || [];
window.ttq.push(['init', '${settings.tiktokPixelId}']);
window.ttq.push(['track', 'PageView']);`}
        </Script>
      ) : null}
    </>
  );
}
