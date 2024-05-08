// src/utils/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

let apolloClientInstance: ApolloClient<any> | null = null;

const createApolloClient = (token: string | null) => {
  if (!apolloClientInstance) {
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
    });
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `${token}` : "",
      },
    }));
    apolloClientInstance = new ApolloClient({
      cache: new InMemoryCache(),
      link: authLink.concat(httpLink),
    });
  }
  return apolloClientInstance;
};

export default createApolloClient;
