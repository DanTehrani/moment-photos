import sharp from 'sharp';
import { logger } from './logger';
import openai from './openai';
import prisma from './prisma';
import { ed, st } from './timer';
import { sleep, uploadImage } from './utils';
import { toFile } from 'openai';

const DEFAULT_INSTRUCTIONS = 'Turn this image into a ghibli style image.';

const convertImage = async ({
  originalImageUrl,
  id,
  instructions,
  userId,
}: {
  originalImageUrl: string;
  id: string;
  instructions: string | null;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    select: {
      defaultPrompt: true,
    },
    where: {
      id: userId,
    },
  });

  const image = await fetch(originalImageUrl);
  const imageBlob = await image.arrayBuffer();

  const form = await toFile(imageBlob, 'image', {
    type: 'image/png',
  });

  const userDefaultPrompt = !!user?.defaultPrompt?.trim();

  const defaultPrompt = userDefaultPrompt
    ? user?.defaultPrompt
    : DEFAULT_INSTRUCTIONS;

  logger.info(
    `Converting image ${id} with prompt: ${defaultPrompt} ${instructions ?? ''}`
  );

  const timer = st('editImage');
  const imageResponse = await openai.images.edit({
    model: 'gpt-image-1',
    prompt: `${defaultPrompt} ${instructions ?? ''}`,
    size: '1024x1024',
    image: form,
    n: 1,
    quality: process.env.RENDER === 'true' ? 'high' : 'low',
  });
  ed(timer);

  const base64 = imageResponse.data?.[0].b64_json;

  if (!base64) {
    throw new Error('No edited image urls');
  }

  const jpegImage = await sharp(Buffer.from(base64, 'base64'))
    .jpeg()
    .toBuffer();

  const editedImageUrl = await uploadImage(jpegImage.toString('base64'));

  await prisma.image.update({
    where: {
      id,
    },
    data: {
      editedImageUrl,
    },
  });
};

const editor = async () => {
  while (true) {
    try {
      const conversionJobs = await prisma.image.findMany({
        select: {
          id: true,
          originalImageUrl: true,
          instructions: true,
          userId: true,
        },
        where: {
          editedImageUrl: null,
        },
      });

      const batchSize = 3;

      for (let i = 0; i < conversionJobs.length; i += batchSize) {
        const batch = conversionJobs.slice(i, i + batchSize);
        if (batch.length > 0) {
          await Promise.all(
            batch.map(conversionJob => convertImage(conversionJob))
          );
        }
      }

      if (conversionJobs.length === 0) {
        logger.info('No conversion jobs found');
      }

      await sleep(3000);
    } catch (error) {
      logger.error('Error in worker loop:', error);
      await sleep(3000);
    }
  }
};

export default editor;
