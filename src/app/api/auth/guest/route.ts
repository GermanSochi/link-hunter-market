import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function randomId(len = 8) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST() {
  const id = randomId(8);
  const email = `guest_${id}@aimarket.dev`;
  const name = `Гость_${id.toUpperCase()}`;
  // Password: 12-char mix — returned once, user can change later
  const rawPassword = randomId(12);

  const passwordHash = await bcrypt.hash(rawPassword, 8);

  try {
    await prisma.user.create({
      data: {
        email,
        name,
        username: `guest_${id}`,
        passwordHash,
        role: "USER",
        balanceCoins: 50, // welcome bonus
      },
    });
  } catch {
    // Unlikely collision — retry with different id
    const id2 = randomId(10);
    const email2 = `guest_${id2}@aimarket.dev`;
    await prisma.user.create({
      data: {
        email: email2,
        name: `Гость_${id2.toUpperCase()}`,
        username: `guest_${id2}`,
        passwordHash,
        role: "USER",
        balanceCoins: 50,
      },
    });
    return NextResponse.json({ email: email2, password: rawPassword });
  }

  return NextResponse.json({ email, password: rawPassword });
}
