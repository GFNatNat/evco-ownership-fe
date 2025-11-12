// import type { Metadata } from 'next';
// // import '../app/globals.css';
// import { CssBaseline, ThemeProvider } from '@mui/material';
// import theme from '@/lib/theme';

// export const metadata: Metadata = {
//   title: 'EV Co-ownership',
//   description: 'EV Co-ownership & Cost-sharing System',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="vi">
//       <body>
//         <ThemeProvider theme={theme}>
//           <CssBaseline />
//           <div className="min-h-screen bg-gray-50">{children}</div>
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }

"use client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00bcd4" },
    background: { default: "#121212", paper: "#1e1e1e" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-black text-white">
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
