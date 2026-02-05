import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Open World Factbook",
  description: "The world's most comprehensive open-source country database. 262 countries & territories — free forever.",
  keywords: ["world factbook", "countries", "geography", "demographics", "government", "economy"],
  authors: [{ name: "Open World Factbook Contributors" }],
  openGraph: {
    title: "Open World Factbook",
    description: "The world's most comprehensive open-source country database.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts for typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
