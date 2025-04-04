import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css";
import { SessionProvider } from 'next-auth/react';

const inter = Lexend({ subsets: ["latin"] });

let title = "Quest Research";
let description =
  "LLM based autonomous agent that conducts local and web research on any topic and generates a comprehensive report with citations.";
let url = "https://sea.quest.ac";
let ogimage = "/quest-logo.png";
let sitename = "Quest Research";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/quest-logo.png",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html className="gptr-root" lang="en">
      <head>
        <PlausibleProvider domain="localhost:3000" />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      </head>
      <body
        className={`${inter.className} flex min-h-screen flex-col justify-between`}
        suppressHydrationWarning
      >
        <SessionProvider> 
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
