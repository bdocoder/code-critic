import "@fontsource/inter";
import { CssBaseline, CssVarsProvider, Stack } from "@mui/joy";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { getUserId } from "@/utils/server";
import theme from "./theme";

export default function RootLayout({ children }) {
  const id = getUserId();

  return (
    <html lang="en">
      <body>
        <CssVarsProvider defaultColorScheme="dark" theme={theme}>
          <CssBaseline />
          <Stack minHeight="100vh">
            <Navbar />
            <Stack direction="row" flexGrow={1}>
              {id && <Sidebar />}
              <Stack component="main" flexGrow={1} useFlexGap>
                {children}
              </Stack>
            </Stack>
          </Stack>
        </CssVarsProvider>
      </body>
    </html>
  );
}
