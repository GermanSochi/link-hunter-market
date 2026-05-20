import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ё/g, "e").replace(/[а-яА-Я]/g, (c) => {
      const map: Record<string, string> = {
        а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ж:"zh",з:"z",и:"i",й:"y",
        к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",
        ф:"f",х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
      };
      return map[c.toLowerCase()] ?? c;
    })
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 80);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const category = url.searchParams.get("category") ?? undefined;
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: [{ isGold: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true, isGoldSeller: true },
        },
        _count: { select: { votes: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.isReadOnly) {
    return NextResponse.json({ error: "Аккаунт в режиме только чтения (karma < -20)" }, { status: 403 });
  }

  const body = await req.json();
  const { title, content, category = "general", tags = [], status = "PUBLISHED" } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Заголовок и текст обязательны" }, { status: 400 });
  }

  const baseSlug = slugify(title) || `post-${Date.now()}`;
  const existing = await prisma.post.findUnique({ where: { slug: baseSlug } });
  const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;

  const post = await prisma.post.create({
    data: {
      authorId: session.user.id,
      title: title.trim(),
      slug,
      content: content.trim(),
      category,
      tags: Array.isArray(tags) ? tags.slice(0, 8) : [],
      status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    },
    include: {
      author: { select: { id: true, name: true, username: true, image: true, isGoldSeller: true } },
    },
  });

  return NextResponse.json(post, { status: 201 });
}
