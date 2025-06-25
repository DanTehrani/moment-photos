import { storage } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { getDownloadURL, ref } from 'firebase/storage';
import { getUserId } from '@/lib/utils';

const useImageUrl = (imageId: string) => {
  return useQuery({
    queryKey: ['imageUrl', imageId],
    queryFn: async () => {
      const userId = await getUserId();

      if (!userId) {
        throw new Error('User ID not found');
      }

      if (!imageId) {
        return null;
      }
      const url = `moment-photos/${userId}/${imageId}.png`;

      const storageRef = ref(storage, url);
      return getDownloadURL(storageRef);
    },
  });
};

export default useImageUrl;
