"use client";
import { Provider } from "react-redux";
import { store } from "@/utils/redux/store";
import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";
import Head from "next/head";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.title = "Sounds 54";
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = "/icons/favicon.png";
    document.head.appendChild(link);
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>My page title</title>
      </Head>
      <body>
        <ApolloWrapper>
          <Provider store={store}>{children}</Provider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
