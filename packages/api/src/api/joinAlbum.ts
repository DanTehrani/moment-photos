import prisma from '../lib/prisma';
import { JoinAlbumRequestBody } from '../rpcTypes';

const joinAlbum = async (input: JoinAlbumRequestBody) => {
  const { userId, albumId } = input;

  // Add user to album
  const userAlbum = await prisma.userAlbum.upsert({
    where: {
      userId_albumId: {
        userId,
        albumId,
      },
    },
    create: {
      userId,
      albumId,
      role: 'EDITOR',
    },
    update: {
      userId,
      albumId,
      role: 'EDITOR',
    },
  });

  return userAlbum;
};

export default joinAlbum;
