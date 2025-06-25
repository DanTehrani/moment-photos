import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';
import { ASYNC_STORAGE_KEYS } from './asyncStorageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { USER_ID_KEY } from './secureStorageKeys';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL } from 'firebase/storage';
import { uploadBytes } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { ref } from 'firebase/storage';
import app from './firebase';
import * as Clipboard from 'expo-clipboard';

export const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/*
export const compressImage = async (uri: string) => {
  const result = await Image.compress(uri, {
    quality: 0.1,
  });

  return result;
};
*/

export const triggerHapticFeedback = () => {
  if (Platform.OS === 'ios') {
    ReactNativeHapticFeedback.trigger('longPress', hapticOptions);
  }
};

/**
 * Clear all async storage values
 */
export const clearAsyncStorage = async () => {
  await Promise.all(
    ASYNC_STORAGE_KEYS.map(key => AsyncStorage.removeItem(key))
  );
};

/**
 * Clear all secure storage values
 */
export const clearSecureStorage = async () => {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};

export const getUserId = async () => {
  return 'c430b69b-dedc-478f-a2b4-36a81ebf4850';
  const userId = await SecureStore.getItemAsync(USER_ID_KEY);
  return userId;
};

export const setUserId = async (userId: string) => {
  await SecureStore.setItemAsync(USER_ID_KEY, userId);
};

export const clearUserId = async () => {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};

export const uploadImage = async (imageUrl: string) => {
  const storage = getStorage(app);
  const blob = await (await fetch(imageUrl)).blob();

  const storageRef = ref(storage, `moment-images/${uuidv4()}`);

  const uploadTask = await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(uploadTask.ref);

  return downloadUrl;
};

export const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
};

export const getImageUrl = async (imageId: string) => {
  const userId = await getUserId();

  if (!userId) {
    return null;
  }

  const storage = getStorage(app);
  const storageRef = ref(storage, `moment-images/${userId}/${imageId}.png`);

  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
