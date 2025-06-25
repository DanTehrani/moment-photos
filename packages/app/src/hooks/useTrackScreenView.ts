import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import useAppTrack from './useAppTrack';

const useTrackScreenView = () => {
  const { track } = useAppTrack();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', e => {
      try {
        const currentRoute =
          e.data.state.routes[e.data.state.routes.length - 1];

        const isTab = currentRoute.name === 'Tabs';

        if (isTab) {
          // For tab routes, get the currently selected tab
          const tabState = currentRoute.state;
          if (tabState) {
            if (tabState.index !== undefined) {
              const currentTab = tabState.routes[tabState.index];
              track({
                screen: currentTab.name,
              });
            }
          }
        } else {
          // For stack routes, use the route name directly
          track({
            screen: currentRoute.name,
          });
        }
      } catch (error) {
        Sentry.captureException(error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);
};

export default useTrackScreenView;
