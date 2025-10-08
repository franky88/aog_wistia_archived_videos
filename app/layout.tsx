import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/navigation";
import FooterPage from "@/components/footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AOG Wistia Archived Videos",
  description: "List AOG of archived videos from wistia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex flex-col items-center justify-between h-screen">
          <div className="flex flex-col items-start p-8">
            <Navigation />
            <div className="w-full flex items-center justify-center mt-8">
              <h2 className="text-3xl font-bold">
                AdOnGroup Wistia Video Archived
              </h2>
            </div>

            {children}
          </div>
          <FooterPage />
        </main>
      </body>
    </html>
  );
}
