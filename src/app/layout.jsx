import "@fontsource/inter";
import "tailwindcss/tailwind.css";
import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import { Theme } from "@radix-ui/themes";
import Navbar from "./Navbar";
import { getUserId } from "@/utils/server";
import Sidebar from "./Sidebar";

export default function RootLayout({ children }) {
  const id = getUserId();

  return (
    <html lang="en">
      <body>
        <Theme>
          <div className="flex flex-wrap content-start min-h-screen bg-accent-1">
            <Navbar />
            {id && <Sidebar />}
            <main className="flex flex-col flex-grow min-h-[calc(100vh-52px)]">
              {children}
            </main>
          </div>
        </Theme>
      </body>
    </html>
  );
}
