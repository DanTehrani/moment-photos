import prisma from '../lib/prisma';
import { UpdateUserSettingsRequestBody } from '../rpcTypes';

const updateUserSettings = async (input: UpdateUserSettingsRequestBody) => {
  const { userId, defaultPrompt } = input;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      defaultPrompt,
    },
  });

  return updatedUser;
};

export default updateUserSettings;
