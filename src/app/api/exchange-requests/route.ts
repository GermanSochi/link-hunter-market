import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { links } = await req.json();
  if (!links || !Array.isArray(links) || links.length === 0) {
    return NextResponse.json({ error: "Links are required" }, { status: 400 });
  }

  const userId = session.user.id;

  const existingLinks = await prisma.product.findMany({
    where: {
      groupUrl: {
        in: links,
      },
    },
    select: { groupUrl: true },
  });

  const existingUrls = new Set(existingLinks.map((p) => p.groupUrl));

  const uniqueNewLinks = links.filter((link) => !existingUrls.has(link));

  if (uniqueNewLinks.length === 0) {
    return NextResponse.json(
      { error: "All links already exist in our database" },
      { status: 400 }
    );
  }

  const exchangeRequest = await prisma.exchangeRequest.create({
    data: {
      userId,
      links: uniqueNewLinks,
      status: "PENDING",
    },
  });

  return NextResponse.json({ exchangeRequest }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const requests = await prisma.exchangeRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests }, { status: 200 });
}
