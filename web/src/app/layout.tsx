import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import Providers from "@/app/providers";
import { headers } from "next/headers";
import { getServerSession } from "next-auth/next";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

/* import AppSidebar from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner"; */
import { authOptions } from "@/server/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pet NFT Marketplace",
  description: "The best pet NFT marketplace!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookie = headersList.get("cookie");
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-screen`}
      >
        <Providers session={session} cookie={cookie}>
          <div className="h-full flex flex-col">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 overflow-auto ms-2">
                {children}
              </main>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
