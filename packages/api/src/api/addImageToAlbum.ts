import prisma from '../lib/prisma';
import { AddImageToAlbumRequestBody } from '../rpcTypes';

const addImageToAlbum = async (req: AddImageToAlbumRequestBody) => {
  const { imageId, albumId } = req;

  const image = await prisma.image.update({
    where: {
      id: imageId,
    },
    data: {
      albumId,
    },
  });

  return image;
};

export default addImageToAlbum;
