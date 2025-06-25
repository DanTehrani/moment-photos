import { trpc } from '@/lib/trpc';
import useUserId from './useUserId';

const useAlbum = (albumId: string) => {
  const { data: userId } = useUserId();
  const { data: albums } = trpc.getAlbums.useQuery(
    { userId: userId ?? '' },
    {
      enabled: !!userId,
    }
  );

  const album = albums?.find(album => album.Album.id === albumId);

  return album;
};

export default useAlbum;
