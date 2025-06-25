import prisma from '../lib/prisma';
import { GetUserSettingsRequestBody } from '../rpcTypes';

const getUserSettings = async (input: GetUserSettingsRequestBody) => {
  const { userId } = input;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      profilePictureUrl: true,
      defaultPrompt: true,
    },
  });

  return user;
};

export default getUserSettings;
