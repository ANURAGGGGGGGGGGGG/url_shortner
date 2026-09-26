import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "URL Shortener",
  description: "A secure, privacy-focused URL shortener that doesn't store your data. Generate short links instantly without tracking or cookies.",
  keywords: "URL shortener, privacy, secure, no tracking, short links",
  authors: [{ name: "URL Shortener" }],
  robots: "index, follow",
  openGraph: {
    title: "URL Shortener",
    description: "A secure, privacy-focused URL shortener that doesn't store your data.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
