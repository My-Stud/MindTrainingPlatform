import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { verifyApiAccess, unauthorizedResponse } from "@/lib/api-auth";

const prisma = new PrismaClient();

export async function GET(request) {
  const access = await verifyApiAccess(request);
  if (!access.authorized) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const userId = searchParams.get("userId") || "";
  const gameId = searchParams.get("gameId") || "";

  const where = {};
  if (userId) where.userId = userId;
  if (gameId) where.gameId = gameId;

  const [scores, total] = await Promise.all([
    prisma.score.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        game: { select: { id: true, name: true, category: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.score.count({ where }),
  ]);

  return NextResponse.json({
    scores,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
