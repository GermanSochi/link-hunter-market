/**
 * Safe admin upsert — does NOT wipe any data.
 * Run: npx tsx prisma/upsert-admin.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("r00tr00t", 12);

  const admin = await prisma.user.upsert({
    where: { email: "german@aimarket.dev" },
    update: {
      passwordHash: hash,
      role: "SUPERADMIN",
      isActive: true,
      isBanned: false,
      lockedUntil: null,
      failedLoginCount: 0,
      karma: 9999,
      name: "German",
      username: "German",
    },
    create: {
      email: "german@aimarket.dev",
      name: "German",
      username: "German",
      passwordHash: hash,
      role: "SUPERADMIN",
      isActive: true,
      isBanned: false,
      lockedUntil: null,
      failedLoginCount: 0,
      karma: 9999,
    },
  });

  console.log("✅ SUPERADMIN ready:", admin.email, "/ id:", admin.id);
  console.log("   Login: german@aimarket.dev  |  Password: r00tr00t");
}

main().catch(console.error).finally(() => prisma.$disconnect());
