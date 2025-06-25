import { ConvertImagesRequestBody } from '../rpcTypes';
import { uploadImage } from '../lib/utils';
import prisma from '../lib/prisma';

const convertImages = async ({
  images,
  userId,
  albumId,
}: ConvertImagesRequestBody) => {
  const imageIds = await Promise.all(
    images.map(image => uploadImage(image.base64))
  );

  await prisma.image.createMany({
    data: imageIds.map((imageId, index) => ({
      originalImageUrl: imageId,
      userId,
      width: images[index].width,
      height: images[index].height,
      albumId,
    })),
  });
};

export default convertImages;
