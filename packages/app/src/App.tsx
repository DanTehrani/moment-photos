// 3. React Native needs crypto.getRandomValues polyfill and sha512
import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamsList, RootTabsParamsList } from './navigation/types';
import { NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { trpc, getRpcLinks } from './lib/trpc';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { triggerHapticFeedback } from './lib/utils';
import ErrorBoundary from './components/ErrorBoundary';
import useTypedNavigation from './hooks/useTypedNavigation';
import colors from './lib/styles/colors';
import useNetworkStatus from './hooks/useNetworkStatus';
import useAutoUpdate from './hooks/useAutoUpdate';
import Dev from './screens/Dev';
import SelectLanguage from './screens/SelectLanguage';
import { useTranslation } from 'react-i18next';
import { getSelectedLanguage, saveSelectedLanguage } from './i18n';
import * as Localization from 'expo-localization';
import ImageFullScreen from './screens/ImageFullScreen';
import Album from './screens/Album';
import CreateAlbum from './screens/CreateAlbum';
import SelectImages from './screens/SelectImages';
import Images from './screens/Images';
import Albums from './screens/Albums';
import { Feather } from '@expo/vector-icons';
import AlbumSettings from './screens/AlbumSettings';
import Settings from './screens/Settings';
import Advanced from './screens/Advanced';
import AlbumImageFullScreen from './screens/AlbumImageFullScreen';
import * as Linking from 'expo-linking';
import JoinAlbum from './screens/JoinAlbum';
import useTrackScreenView from './hooks/useTrackScreenView';
import queryKeys from './queryKeys/queryKeys';
import useLanguage from './hooks/useLanguage';
import Welcome from './screens/Welcome';

Sentry.init({
  dsn: 'https://ce7909f4fe27eac83fb6c5ed52778e76@o4507910178799616.ingest.us.sentry.io/4509330897829888',
  debug: false,
  enabled: process.env.NODE_ENV !== 'development',
  attachStacktrace: false,
  sendDefaultPii: false,
});

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      JoinAlbum: 'join/:albumId/:albumName',
    },
  },
};

const Tab = createBottomTabNavigator<RootTabsParamsList>();
const RootStack = createNativeStackNavigator<RootStackParamsList>();

const Tabs = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Images"
      screenOptions={{
        tabBarButton: props => (
          <TouchableWithoutFeedback
            onPress={e => {
              triggerHapticFeedback();
              props.onPress?.(e);
            }}
          >
            <View style={{ flex: 1 }}>{props.children}</View>
          </TouchableWithoutFeedback>
        ),
      }}
    >
      <Tab.Screen
        name="Images"
        component={Images}
        options={{
          title: t('Images:title'),
          headerShown: false,
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Feather name="image" size={24} color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Albums"
        component={Albums}
        options={{
          title: t('Albums:title'),
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Feather name="folder" size={24} color={color} />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: t('Settings:title'),
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const Screens = () => {
  const navigation = useTypedNavigation();
  const { i18n, t } = useTranslation();

  // Init screen tracker
  useTrackScreenView();

  const { data: language } = useLanguage();

  useEffect(() => {
    (async () => {
      let lang = await getSelectedLanguage();

      if (!lang) {
        const locales = Localization.getLocales();

        if (locales.length > 0 && locales[0].languageCode === 'ja') {
          await saveSelectedLanguage('ja');
          lang = 'ja';
        } else {
          await saveSelectedLanguage('en');
          lang = 'en';
        }

        queryClient.invalidateQueries({
          queryKey: queryKeys.language,
        });
      }

      i18n.changeLanguage(lang);
    })();
  }, [language]);

  // Don't show anything until the language is set.
  if (language === null) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}></View>
    );
  }

  return (
    <ErrorBoundary navigation={navigation}>
      <TouchableWithoutFeedback
        accessible={false}
        style={{ flex: 1, backgroundColor: 'blue' }}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <RootStack.Navigator>
              <RootStack.Screen
                name="Tabs"
                component={Tabs}
                options={{
                  headerShown: false,
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="ImageFullScreen"
                component={ImageFullScreen}
                options={{
                  headerShown: false,
                  animation: 'fade_from_bottom',
                  animationDuration: 150,
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="AlbumImageFullScreen"
                component={AlbumImageFullScreen}
                options={{
                  headerShown: false,
                  animation: 'fade_from_bottom',
                  animationDuration: 150,
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="CreateAlbum"
                component={CreateAlbum}
                options={{
                  title: t('CreateAlbum:title'),
                  headerBackTitle: t('common:back'),
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="SelectImages"
                component={SelectImages}
                options={{
                  title: t('SelectImages:title'),
                  headerBackTitle: t('common:back'),
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="Albums"
                component={Albums}
                options={{
                  title: t('Albums:title'),
                  headerBackTitle: t('common:back'),
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="Album"
                component={Album}
                options={{
                  title: t('Album:title'),
                  headerBackTitle: t('common:back'),
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="AlbumSettings"
                component={AlbumSettings}
                options={{
                  headerBackTitle: t('common:back'),
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="Dev"
                component={Dev}
                options={{}}
              ></RootStack.Screen>
              <RootStack.Screen
                name="SelectLanguage"
                component={SelectLanguage}
                options={{
                  title: t('SelectLanguage:title'),
                }}
              ></RootStack.Screen>
              <RootStack.Screen
                name="Advanced"
                component={Advanced}
                options={{
                  title: t('Advanced:title'),
                  headerBackTitle: t('common:back'),
                }}
              />
              <RootStack.Screen
                name="JoinAlbum"
                component={JoinAlbum}
                options={{
                  title: t('JoinAlbum:title'),
                  headerBackTitle: t('common:back'),
                }}
              />
              <RootStack.Screen
                name="Welcome"
                component={Welcome}
                options={{
                  headerShown: false,
                }}
              />
            </RootStack.Navigator>
          </BottomSheetModalProvider>
          <Toast></Toast>
        </GestureHandlerRootView>
      </TouchableWithoutFeedback>
    </ErrorBoundary>
  );
};

const NavigationTheme = {
  dark: false,
  colors,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: process.env.NODE_ENV === 'development',
      // throwOnError: false,
      retry: 3,
      // retry: 3,
      gcTime: 1000 * 60 * 60 * 24,
    },
    mutations: {
      throwOnError: process.env.NODE_ENV === 'development',
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const App = () => {
  const [loaded, error] = useFonts({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Nunito-Regular': require('../assets/Nunito-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Nunito-Bold': require('../assets/Nunito-Bold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'EBGaramond-Regular': require('../assets/EBGaramond-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'EBGaramond-Bold': require('../assets/EBGaramond-Bold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Lato-Regular': require('../assets/Lato-Regular.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Lato-Bold': require('../assets/Lato-Bold.ttf'),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    'Lato-Italic': require('../assets/Lato-Italic.ttf'),
  });

  const isOffline = useNetworkStatus();

  useEffect(() => {
    if (isOffline) {
      Toast.show({
        type: 'error',
        text1: 'Offline',
        text2: 'You are currently offline.',
      });
    }
  }, [isOffline]);

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const { isUpdating } = useAutoUpdate();

  if (!loaded) {
    return null;
  }

  if (isUpdating === null || isUpdating) {
    return null;
  }

  const trpcClient = trpc.createClient({
    links: getRpcLinks(),
  });

  return (
    <NavigationContainer linking={linking}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: asyncStoragePersister,
            buster: '45',
          }}
        >
          <ThemeProvider value={NavigationTheme}>
            <SafeAreaProvider>
              <Screens></Screens>
              <StatusBar style="light" />
            </SafeAreaProvider>
          </ThemeProvider>
        </PersistQueryClientProvider>
      </trpc.Provider>
    </NavigationContainer>
  );
};

export default Sentry.wrap(App);
