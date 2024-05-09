import "./globals.css";

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: {
        template: 'Sounds 54',
        default: 'Sounds 54',
        absolute: 'Sounds 54',
    },
    icons: {
        icon: '/icon.png'
    }
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
      {children}
      </body>
    </html>
  );
}
