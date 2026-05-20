import { Inter } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import Providers from "@/components/providers/Providers";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="h-full" suppressHydrationWarning>
      <body
        className={cn("relative h-full font-sans antialiased bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200", inter.className)}
      >
        <main className="relative flex flex-col min-h-screen">
          <Providers>
            <NavBar />
            <div className="flex-grow flex-1">{children}</div>
            <Footer />
          </Providers>
        </main>

        <Toaster position="top-center" richColors />
        <CookieBanner />
      </body>
    </html>
  );
}
