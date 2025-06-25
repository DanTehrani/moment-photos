import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';

const useSelectImage = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0,
        allowsMultipleSelection: true,
        selectionLimit: 10,
        base64: true,
      });

      return result;
    },
  });
};

export default useSelectImage;
