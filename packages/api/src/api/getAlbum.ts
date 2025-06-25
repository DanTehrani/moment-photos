import prisma from '../lib/prisma';
import { GetAlbumRequestBody } from '../rpcTypes';

const getAlbum = async (req: GetAlbumRequestBody) => {
  const { albumId } = req;

  const album = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
    select: {
      id: true,
      name: true,
      thumbnailImageId: true,
      sharableLink: true,
      images: {
        select: {
          id: true,
          editedImageUrl: true,
          originalImageUrl: true,
        },
      },
      users: {
        select: {
          role: true,
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
  });

  if (!album) {
    throw new Error('Album not found');
  }

  return album;
};

export default getAlbum;
