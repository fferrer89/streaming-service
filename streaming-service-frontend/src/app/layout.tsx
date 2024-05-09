import "./globals.css";
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: {
        template: 'Sound 54',
        default: 'Sound 54',
        absolute: 'Sound 54',
    },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
          {children}
       </body>
    </html>
  );
}
