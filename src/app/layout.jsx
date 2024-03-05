import "@fontsource/inter";
import "tailwindcss/tailwind.css";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import { Theme } from "@radix-ui/themes";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DTLogger from "@/components/DTLogger";
import NextThemeProvider from "./NextThemeProvider";
import { auth } from "@/auth";

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <DTLogger />
        <NextThemeProvider>
          <Theme>
            <div className="min-h-screen bg-accent-1 grid grid-cols-[240px_1fr] grid-rows-[52px_1fr]">
              <Navbar />
              {session?.user && <Sidebar />}
              <main
                className={`flex flex-col${session?.user ? "" : " col-span-2"}`}
              >
                {children}
              </main>
            </div>
          </Theme>
        </NextThemeProvider>
      </body>
    </html>
  );
}
