import prisma from '../lib/prisma';
import { EditAlbumNameRequestBody } from '../rpcTypes';

const editAlbumName = async (req: EditAlbumNameRequestBody) => {
  const { albumId, name } = req;

  // Update the album's name
  const updatedAlbum = await prisma.album.update({
    where: {
      id: albumId,
    },
    data: {
      name,
    },
  });

  return updatedAlbum;
};

export default editAlbumName;
