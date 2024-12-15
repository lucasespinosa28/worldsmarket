import { config } from "@/config";
import { cookieToInitialState } from "@account-kit/core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import Link from "next/link";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Account Kit Quickstart",
  description: "Account Kit Quickstart NextJS Template",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <nav className="bg-gray-800 text-white p-4 mb-8">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">WorldMarket</div>
            <div className="flex gap-4">
              <Link className="hover:text-gray-300 transition-colors" href="/">
                Home
              </Link>
              <Link className="hover:text-gray-300 transition-colors" href="/faucet">
                Faucet
              </Link>
              <Link className="hover:text-gray-300 transition-colors" href="/exchange">
                Exchange
              </Link>
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4">
          <Providers initialState={initialState}>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
