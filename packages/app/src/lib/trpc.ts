import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
} from '@trpc/react-query';
import type { AppRouter } from '@moment/api';

export const trpc = createTRPCReact<AppRouter>();

const EXPO_PUBLIC_RPC_URL =
  process.env.EXPO_PUBLIC_RPC_URL || 'http://localhost:3000';

export const getRpcLinks = () => {
  return [
    httpBatchLink({
      url: EXPO_PUBLIC_RPC_URL as string,
      async headers() {
        if (!EXPO_PUBLIC_RPC_URL) {
          throw new Error('Missing EXPO_PUBLIC_RPC_URL');
        }

        return {};
      },
    }),
  ];
};

export const getRpcClient = () => {
  return createTRPCClient<AppRouter>({
    links: getRpcLinks(),
  });
};
