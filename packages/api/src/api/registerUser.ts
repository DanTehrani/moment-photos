import { Prisma } from '@moment/db';
import prisma from '../lib/prisma';

const registerUser = async (userId: string) => {
  const data: Prisma.UserCreateInput = {
    id: userId,
  };

  await prisma.user.upsert({
    where: {
      id: userId,
    },
    update: data,
    create: data,
  });
};

export default registerUser;
