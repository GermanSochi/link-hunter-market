import { auth } from "@/auth";
import { prisma } from "./prisma";

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id, isActive: true, isBanned: false },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      username: true,
      role: true,
      balanceCoins: true,
      frozenCoins: true,
      rating: true,
      karma: true,
      isActive: true,
      isBanned: true,
      isReadOnly: true,
      isGoldSeller: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}
