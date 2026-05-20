import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(72),
        name: z.string().min(2).max(50).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password, name } = input;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Email уже занят" });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, passwordHash, name: name ?? null },
        select: { id: true, email: true, name: true },
      });

      return { success: true, user };
    }),
});
