import {ChakraProvider} from '@chakra-ui/react'; //we could also use manting ui
import {QueryClient, QueryClientProvider} from 'react-query';
import type { AppProps } from 'next/app';

const queryClient = new QueryClient;

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client = {queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
  </QueryClientProvider>
  );
}
