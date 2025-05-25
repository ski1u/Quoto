import { Inter } from "next/font/google";
import "./globals.css";

import { AppProvider } from "@/components/AppProvider";
import { Providers } from "@/components/Providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Quoto",
  description: "",
};

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "greek"]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-[#f9f9f9] text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
