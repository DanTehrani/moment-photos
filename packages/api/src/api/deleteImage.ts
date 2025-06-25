import prisma from '../lib/prisma';
import { DeleteImageRequestBody } from '../rpcTypes';

const deleteImage = async (input: DeleteImageRequestBody) => {
  const { imageId } = input;

  const image = await prisma.image.update({
    where: { id: imageId },
    data: {
      deletedAt: new Date(),
    },
  });

  return image;
};

export default deleteImage;
