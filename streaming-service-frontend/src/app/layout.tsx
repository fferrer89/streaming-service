'use client';
import { Provider } from 'react-redux';
import { store } from '@/utils/redux/store';
import "./globals.css";
<<<<<<< HEAD

=======
import { ApolloWrapper } from "./ApolloWrapper";
const inter = Inter({ subsets: ["latin"] });
>>>>>>> refs/remotes/origin/main


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body > 
        <Provider store={store}>
          {children}
        </Provider>
       </body>
    </html>
=======
    <ApolloWrapper>
      <html lang="en">
        <body className={inter.className}>
          {" "}
          <Navbar />
          {children}
        </body>
      </html>
    </ApolloWrapper>
>>>>>>> refs/remotes/origin/main
  );
}
