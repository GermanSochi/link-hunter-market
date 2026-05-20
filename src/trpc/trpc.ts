import { initTRPC, TRPCError } from "@trpc/server";
import { getSessionUser } from "@/lib/auth";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuth = middleware(async ({ next }) => {
  const user = await getSessionUser();
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
