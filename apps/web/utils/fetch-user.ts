import { prisma } from "@repo/db";

async function getUserIdByEmail(email: string): Promise<string | undefined> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
    },
  });

  return user ? user.id : undefined;
}

export { getUserIdByEmail };
