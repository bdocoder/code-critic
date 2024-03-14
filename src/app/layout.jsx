import "@fontsource/inter";
import "./globals.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DTLogger from "@/components/DTLogger";
import NextThemeProvider from "./NextThemeProvider";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/utils/ui";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <DTLogger />
        <NextThemeProvider>
          <div className="min-h-screen bg-accent-1 grid grid-cols-[240px_1fr] grid-rows-[52px_1fr]">
            <Navbar />
            {session?.user && <Sidebar />}
            <main
              className={cn("flex flex-col", !session?.user && "col-span-2")}
            >
              {children}
            </main>
          </div>
        </NextThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
