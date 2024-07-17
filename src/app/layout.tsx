import type { Metadata } from "next";
import { Sofia_Sans_Semi_Condensed } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const sofiaSans = Sofia_Sans_Semi_Condensed({ subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  title: "Молодёжный глобальный прогноз развития энергетики",
  description: "Индустрия 4.0: Драйверы глобальных изменений энергетики России",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sofiaSans.className}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
