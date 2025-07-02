import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'StackShop',
  description: 'Simple Loyalty Platform for Local Stores',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="text-gray-100 min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(120deg, #181824 0%, #23243a 100%)",
        }}
      >
        <div id="container" className="glass-bg min-h-screen w-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
