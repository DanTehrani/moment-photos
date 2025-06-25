import { TrackRequestBody } from '../rpcTypes';
import prisma from '../lib/prisma';
import Sentry from '../lib/sentry';
import { logger } from '../lib/logger';

const track = async (body: TrackRequestBody) => {
  try {
    await prisma.appEvent.create({
      data: {
        userId: body.userId ?? undefined,
        properties: JSON.parse(JSON.stringify(body.properties)),
        timestamp: new Date(body.timestamp),
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    logger.error('Failed to track app event:', error);
  }
};

export default track;
