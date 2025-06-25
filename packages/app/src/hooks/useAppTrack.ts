import { trpc } from '@/lib/trpc';
import { useCallback, useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import useUserId from './useUserId';

const useAppTrack = () => {
  const { mutate: trackRemote, error } = trpc.track.useMutation({
    throwOnError: false,
  });

  const { data: userId } = useUserId();

  useEffect(() => {
    // Report errors to Sentry
    if (error) {
      Sentry.captureException(error);
    }
  }, [error]);

  const track = useCallback(
    (properties?: Record<string, unknown>) => {
      trackRemote({
        userId: userId ?? undefined,
        properties: properties || {},
        timestamp: Date.now(),
      });
    },
    [trackRemote]
  );

  return { track };
};

export default useAppTrack;
