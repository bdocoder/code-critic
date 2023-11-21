import "@fontsource/inter";
import "tailwindcss/tailwind.css";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import { Theme } from "@radix-ui/themes";
import Navbar from "./Navbar";
import { getUserId } from "@/utils/server";
import Sidebar from "./Sidebar";
import DTLogger from "@/components/DTLogger";

export default function RootLayout({ children }) {
  const id = getUserId();

  return (
    <html lang="en">
      <body>
        <DTLogger />
        <Theme>
          <div className="min-h-screen bg-accent-1 grid grid-cols-[240px_1fr] grid-rows-[52px_1fr]">
            <Navbar />
            {id && <Sidebar />}
            <main className={`flex flex-col${id ? "" : " col-span-2"}`}>
              {children}
            </main>
          </div>
        </Theme>
      </body>
    </html>
  );
}
