import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Police de titrage : serif de labeur, tres lisible en francais, accnee aux
// caracteres accentues (inclus dans le subset latin).
const serifDisplay = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kénitra Weather Archive - Climatologie de Kénitra, Maroc",
  description: "Archives météorologiques complètes de Kénitra, Gharb-Chrarda-Béni Hssen, Maroc. Températures, précipitations et statistiques climatiques.",
  keywords: ["Kénitra", "Météo", "Climatologie", "Maroc", "Archives Météo", "Gharb", "Températures", "Pluie", "Radar Météo", "Rapport Scientifique"],
  authors: [{ name: "Kénitra Weather" }],
  openGraph: {
    title: "Kénitra Weather Archive",
    description: "Climatologie et archives météo de Kénitra, Maroc.",
    url: "https://kenitraarchiveweather.vercel.app",
    siteName: "Kénitra Weather",
    locale: "fr_FR",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${serifDisplay.variable} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">
              {children}
            </main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> Kénitra Weather Archive. Données via{" "}
              <a 
                href="https://open-meteo.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:underline text-primary"
              >
                Open-Meteo
              </a>.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}