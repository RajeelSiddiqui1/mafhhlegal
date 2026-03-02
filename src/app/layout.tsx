import type {Metadata} from 'next';
import './globals.css';
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Mafhh Legal Connect | Professional Paralegal Services',
  description: 'Providing reliable and affordable legal support across Ontario with integrity and professionalism.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-20 md:pt-24">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}