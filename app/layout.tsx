import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadHunter KE — Kenya Business Lead Intelligence",
  description:
    "Discover, analyze, and close Kenya's best B2B leads. AI-powered weakness analysis and cold call scripts for web design, digital marketing, and graphic design agencies.",
  keywords: "Kenya leads, business directory, cold calling, web design Kenya, digital marketing Kenya",
  openGraph: {
    title: "LeadHunter KE",
    description: "Kenya's #1 B2B lead intelligence platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
