import { OrdersProvider } from "@/context/OrdersContext";
import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Silekta - Management Information System",
  description:
    "Comprehensive business management system for inventory, suppliers, purchases, and more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className}`}>
        <Providers>
          <OrdersProvider>{children}</OrdersProvider>
        </Providers>
      </body>
    </html>
  );
}
