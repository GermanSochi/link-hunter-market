import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const product = await prisma.product.findFirst({
        where: { id: { in: productIds }, status: "APPROVED" },
        select: { id: true, title: true, priceCents: true, sellerId: true },
      });

      if (!product) throw new TRPCError({ code: "NOT_FOUND" });

      const commission = Math.ceil(product.priceCents * 0.05);
      const total = product.priceCents + commission;

      const buyer = await prisma.user.findUnique({
        where: { id: user.id },
        select: { balanceCoins: true },
      });

      if (!buyer || buyer.balanceCoins < total) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Недостаточно монет на балансе",
        });
      }

      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            clientId: user.id,
            executorId: product.sellerId,
            productId: product.id,
            status: "FUNDED",
            amountCoins: product.priceCents,
            commissionCoins: commission,
          },
          select: { id: true },
        });

        await tx.user.update({
          where: { id: user.id },
          data: {
            balanceCoins: { decrement: total },
            frozenCoins: { increment: total },
          },
        });

        await tx.transaction.create({
          data: {
            userId: user.id,
            orderId: newOrder.id,
            type: "ESCROW_FREEZE",
            amountCoins: -total,
            balanceAfter: buyer.balanceCoins - total,
            meta: { description: `Оплата заказа #${newOrder.id}` },
          },
        });

        return newOrder;
      });

      return { orderId: order.id, url: `/thank-you?orderId=${order.id}` };
    }),

  pullOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true },
      });

      if (!order) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        isPaid: ["FUNDED", "IN_PROGRESS", "REVIEW", "COMPLETED"].includes(order.status),
        status: order.status,
      };
    }),
});
