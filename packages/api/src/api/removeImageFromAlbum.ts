import prisma from '../lib/prisma';
import { RemoveImageFromAlbumRequestBody } from '../rpcTypes';

const removeImageFromAlbum = async (req: RemoveImageFromAlbumRequestBody) => {
  const { imageId } = req;

  const image = await prisma.image.update({
    where: {
      id: imageId,
    },
    data: {
      albumId: null,
    },
  });

  return image;
};

export default removeImageFromAlbum;
