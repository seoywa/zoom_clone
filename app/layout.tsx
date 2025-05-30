import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import '@stream-io/video-react-sdk/dist/css/styles.css'
import type { Metadata } from "next";
import 'react-datepicker/dist/react-datepicker.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YOOM",
  description: "Video calling App",
  icons: {
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider appearance={{
        variables: {
          colorText: '#fff',
          colorPrimary: '#0e78f9',
          colorBackground: '#1c1f2e',
          colorInputBackground: '#252a41',
          colorInputText: '#fff'
        },
        layout: {
          logoImageUrl: '/icons/yoom-logo.svg',
          socialButtonsVariant: 'iconButton'
        }
      }}>
        <body className={`${inter.className} bg-dark-2`} >
          <Toaster />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
