import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://apollo-server:4000/graphql",
  cache: new InMemoryCache(),
});

export default client;
