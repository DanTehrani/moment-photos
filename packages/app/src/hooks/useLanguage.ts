import { getSelectedLanguage } from '@/i18n';
import queryKeys from '@/queryKeys/queryKeys';
import { useQuery } from '@tanstack/react-query';

const useLanguage = () => {
  return useQuery({
    queryKey: queryKeys.language,
    queryFn: async () => {
      const language = await getSelectedLanguage();
      return language;
    },
  });
};

export default useLanguage;
