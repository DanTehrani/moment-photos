import prisma from '../lib/prisma';
import { GetImagesRequestBody } from '../rpcTypes';

const getImages = async ({ userId, albumId }: GetImagesRequestBody) => {
  // If the albumId is provided, first verify that the user has access to this album
  if (albumId) {
    const userAlbum = await prisma.userAlbum.findFirst({
      where: {
        userId,
        albumId,
      },
    });

    if (!userAlbum) {
      throw new Error('Album not found or access denied');
    }

    const images = await prisma.image.findMany({
      select: {
        id: true,
        userId: true,
        originalImageUrl: true,
        editedImageUrl: true,
        width: true,
        height: true,
      },
      where: {
        AND: [
          {
            albumId,
          },
          {
            deletedAt: null,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return images;
  }

  const images = await prisma.image.findMany({
    select: {
      id: true,
      userId: true,
      originalImageUrl: true,
      editedImageUrl: true,
      width: true,
      height: true,
    },
    where: {
      AND: [
        {
          userId,
        },
        {
          deletedAt: null,
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return images;
};

export default getImages;
