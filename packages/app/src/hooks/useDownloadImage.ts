import { useMutation } from '@tanstack/react-query';
import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '@/lib/utils';

const useDownloadImage = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const imageUrl = await getImageUrl(imageId);

      if (!imageUrl) {
        return;
      }

      // 1. Ask for permission to write to gallery
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          t('useDownloadImage:permissionDenied'),
          t('useDownloadImage:pleaseGoToSettingsAndGrantPermissionToSaveImages')
        );
        return;
      }

      // 2. Download to a local file
      const fileName = `${uuidv4()}.png`;
      const localUri = (FileSystem.cacheDirectory ?? '') + fileName;
      const downloadRes = await FileSystem.downloadAsync(imageUrl, localUri);

      // 3. Save into photo library
      await MediaLibrary.createAssetAsync(downloadRes.uri);
    },
  });
};

export default useDownloadImage;
