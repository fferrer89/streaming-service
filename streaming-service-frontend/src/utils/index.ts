import {HttpLink, InMemoryCache, ApolloClient, gql} from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import React from "react";

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: "http://localhost:4000/graphql",
        }),
    });
});
