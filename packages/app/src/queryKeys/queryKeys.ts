const queryKeys = {
  asyncStorageValue: (key: string) => ['asyncStorage', key],
  secureStorageValue: (key: string) => ['secureStorage', key],
  userId: ['userId'] as const,
  language: ['language'] as const,
};

export default queryKeys;
