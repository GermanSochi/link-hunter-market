// Совместимый shim: используется NavBar (server component).
// Делегирует в новый auth.ts на основе Prisma.
export { getSessionUser as getServerSideUser } from "@/lib/auth";
