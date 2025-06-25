import { getUserId } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '@/queryKeys/queryKeys';

const useUserId = () => {
  return useQuery({
    queryKey: queryKeys.userId,
    queryFn: async () => {
      const userId = await getUserId();
      return userId;
    },
  });
};

export default useUserId;
