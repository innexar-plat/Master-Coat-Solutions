import type { Metadata } from "next";
import { PixelScripts } from "@/components/shared/PixelScripts";
import { DM_Serif_Display } from "next/font/google";
import "../styles/globals.css";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mastercoatsolutions.com"),
  title: {
    default: "Master Coat Solutions | Orlando Painting Experts",
    template: "%s | Master Coat Solutions"
  },
  description: "Interior, exterior and trim painting for homes in Orlando and surrounding cities. Fast estimate, premium finish and reliable crew.",
  openGraph: {
    title: "Master Coat Solutions | Orlando Painting Experts",
    description: "Professional residential painting with premium finishes across Orlando.",
    url: "https://mastercoatsolutions.com",
    siteName: "Master Coat Solutions",
    type: "website"
  }
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={dmSerif.variable}>
      <body>
        <PixelScripts />
        {children}
      </body>
    </html>
  );
}
