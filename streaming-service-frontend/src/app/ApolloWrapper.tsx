"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

import { useSelector } from 'react-redux';

import Cookies from 'js-cookie';
const userToken = Cookies.get('token');
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: userToken ? userToken : "",
    },
  };
});
function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
    //fetchOptions: { cache: "no-store" },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink.concat(httpLink),
          ])
        : authLink.concat(httpLink),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
