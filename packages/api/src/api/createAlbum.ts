import prisma from '../lib/prisma';
import { CreateAlbumRequestBody } from '../rpcTypes';

const createAlbum = async (req: CreateAlbumRequestBody) => {
  const { userId, name, imageIds } = req;

  const album = await prisma.$transaction(async tx => {
    const newAlbum = await tx.album.create({
      data: {
        name,
        images: {
          connect: imageIds.map(id => ({ id })),
        },
      },
    });

    await tx.userAlbum.create({
      data: {
        userId,
        role: 'ADMIN',
        albumId: newAlbum.id,
      },
    });

    return newAlbum;
  });

  return album;
};

export default createAlbum;
