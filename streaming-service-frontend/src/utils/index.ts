import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
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
