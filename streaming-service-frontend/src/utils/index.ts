import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_BACKEND_GRAPHQL_URL,
});

// let userToken =  //Add token from local storage
// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: {
//       ...headers,
//       authorization: ,
//     },
//   };
// });

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  // link: authLink.concat(httpLink), // to add token in header.
});

export default apolloClient;
