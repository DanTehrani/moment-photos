import prisma from '../lib/prisma';
import { DeleteAlbumRequestBody } from '../rpcTypes';

const deleteAlbum = async (req: DeleteAlbumRequestBody) => {
  const { albumId } = req;

  // Delete the album and its associated records
  await prisma.$transaction(async tx => {
    // First delete the user-album associations
    await tx.userAlbum.deleteMany({
      where: {
        albumId,
      },
    });

    // Then delete the album itself
    await tx.album.delete({
      where: {
        id: albumId,
      },
    });
  });

  return { success: true };
};

export default deleteAlbum;
