import "@fontsource/inter";
import "./globals.css";
import Navbar from "./Navbar";
import DTLogger from "@/components/DTLogger";
import NextThemeProvider from "./NextThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DTLogger />
        <NextThemeProvider>
          <div className="flex flex-col min-h-screen bg-accent-1">
            <Navbar />
            <main className="flex flex-col flex-grow">{children}</main>
          </div>
        </NextThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
