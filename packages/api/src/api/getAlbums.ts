import prisma from '../lib/prisma';
import { GetAlbumsRequestBody } from '../rpcTypes';

const getAlbums = async (req: GetAlbumsRequestBody) => {
  const { userId } = req;

  const albums = await prisma.userAlbum.findMany({
    select: {
      role: true,
      Album: {
        select: {
          id: true,
          name: true,
          thumbnailImageId: true,
          images: {
            select: {
              id: true,
              editedImageUrl: true,
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
      },
    },
    where: {
      userId,
    },
  });

  return albums;
};

export default getAlbums;
