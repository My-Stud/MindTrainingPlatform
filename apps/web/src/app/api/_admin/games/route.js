import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import { verifyApiAccess, unauthorizedResponse } from "@/lib/api-auth";

const prisma = new PrismaClient();

export async function GET(request) {
  const access = await verifyApiAccess(request);
  if (!access.authorized) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "";

  const where = {};
  if (category) where.category = category;

  const games = await prisma.game.findMany({
    where,
    include: {
      _count: { select: { scores: true, questionSets: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ games });
}
