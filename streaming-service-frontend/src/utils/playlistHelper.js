import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

let ArtistToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzdlNTAyMmNhODQ1M2VkNDk4MTU0MSIsInJvbGUiOiJBUlRJU1QiLCJuYW1lIjoiQk9CIiwiaWF0IjoxNzE0OTM5MTM4LCJleHAiOjE3MTU4MDMxMzh9.gg5p-Lz1wQ7jIoGOMB4LoJ7ONSIFraIAaQj98O7R0wM";
let userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MzhkNTNlMjg3YWZhYTdkYzgxMGRlZiIsInJvbGUiOiJ1c2VyIiwibmFtZSI6IkFscGhhIiwiaWF0IjoxNzE1MDAwNjM5LCJleHAiOjE3MTU4NjQ2Mzl9.2lvtEOrN0RW4hFHixkrSGwEqUukr-UZdBnAU9fnd4xI";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_SERVER_URL,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: userToken,
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
