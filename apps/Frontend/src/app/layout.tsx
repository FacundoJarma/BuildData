import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AuthWrapper from "./AuthWrapper";

const ManropeFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "BuildData",
  description: "Plataforma de gestión de obras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${ManropeFont.variable}  h-full antialiased`}>
      <body className="min-h-screen flex flex-col">
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
