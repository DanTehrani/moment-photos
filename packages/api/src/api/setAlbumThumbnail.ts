import prisma from '../lib/prisma';
import { SetAlbumThumbnailRequestBody } from '../rpcTypes';

const setAlbumThumbnail = async (req: SetAlbumThumbnailRequestBody) => {
  const { albumId, imageId } = req;

  // Update the album's thumbnail
  const updatedAlbum = await prisma.album.update({
    where: {
      id: albumId,
    },
    data: {
      thumbnailImageId: imageId,
    },
  });

  return updatedAlbum;
};

export default setAlbumThumbnail;
