import { useMutation } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';

const useSelectImage = () => {
  return useMutation({
    mutationFn: async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1],
        base64: true,
      });

      return result;
    },
  });
};

export default useSelectImage;
