import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tiny Link",
  description: "Premium URL Shortener",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#fffcfc]`}
      >
         <Header />
        <div className="min-h-screen bg-[#fffcfc] flex flex-col">
         
          <main className="flex-1">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}