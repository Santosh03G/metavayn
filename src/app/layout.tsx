import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/lib/lenis";
import { PageTransition } from "@/components/layout/PageTransition";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#2347E0",
};

export const metadata: Metadata = {
  title: "Metavayn Technologies Pvt. Ltd. | Engineering the Next Dimension",
  description:
    "We help global OEMs and engineering-driven businesses accelerate product development, expand engineering capacity, and deliver better products faster.",
  metadataBase: new URL("https://metavayn.com"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Metavayn Technologies | Engineering the Next Dimension",
    description:
      "Engineering services for product development, mechanical design, HVAC, manufacturing, and OEM engineering support.",
    url: "https://metavayn.com",
    siteName: "Metavayn Technologies",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Metavayn Technologies D2 Engineering Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-black text-paper antialiased selection:bg-royal selection:text-paper">
        <SmoothScroll>
          <Header />
          <PageTransition>
            <main className="flex-1 flex flex-col">{children}</main>
          </PageTransition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
