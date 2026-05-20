import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { QueryValidator } from "../lib/validators/query-validator";
import { prisma } from "@/lib/prisma";
import { paymentRouter } from "./payment-router";

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor, limit } = input;
      const { sort, ...queryOpts } = query;

      const page = cursor || 1;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = { status: "APPROVED" };
      if (queryOpts.category) where.category = queryOpts.category;

      const orderBy = sort === "desc"
        ? { createdAt: "desc" as const }
        : { createdAt: "asc" as const };

      const [items, total] = await Promise.all([
        prisma.product.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: { seller: { select: { id: true, name: true, rating: true } } },
        }),
        prisma.product.count({ where }),
      ]);

      const hasNextPage = skip + items.length < total;
      const nextPage = hasNextPage ? page + 1 : null;

      const normalizedItems = items.map((p) => ({
        ...p,
        images: typeof p.images === "string" ? JSON.parse(p.images) : (p.images ?? []),
      }));

      return { items: normalizedItems, nextPage };
    }),
});

export type TAppRouter = typeof appRouter;
