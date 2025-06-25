import prisma from '../lib/prisma';

const recreateImage = async ({
  imageId,
  instructions,
}: {
  imageId: string;
  instructions?: string;
}) => {
  const image = await prisma.image.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    throw new Error('Image not found');
  }

  await prisma.image.create({
    data: {
      originalImageUrl: image.originalImageUrl,
      userId: image.userId,
      width: image.width,
      height: image.height,
      instructions,
    },
  });
};

export default recreateImage;
