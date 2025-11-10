import type { Metadata } from 'next';
// import '../app/globals.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/lib/theme';

export const metadata: Metadata = {
  title: 'EV Co-ownership',
  description: 'EV Co-ownership & Cost-sharing System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="min-h-screen bg-gray-50">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
