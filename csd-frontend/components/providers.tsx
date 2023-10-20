// app/providers.tsx

import { CacheProvider } from "@chakra-ui/next-js";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import client from "@/components/apollo-client";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
