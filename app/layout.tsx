import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/hooks/useTheme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sudharsan Surya · Full-Stack Software Engineer",
  description:
    "Portfolio of Sudharsan Surya — full-stack software engineer focused on product engineering, startups, and polished user experiences.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} dark`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
