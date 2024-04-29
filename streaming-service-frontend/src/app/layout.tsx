'use client';
import { Provider } from 'react-redux';
import { store } from '@/utils/redux/store';
import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body > 
      <ApolloWrapper>
        <Provider store={store}>
          {children}
        </Provider>
        </ApolloWrapper>
       </body>
    </html>
  );
}
