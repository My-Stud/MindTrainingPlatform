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
  const search = searchParams.get("search") || "";

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const [questionSets, total] = await Promise.all([
    prisma.questionSet.findMany({
      where,
      include: {
        _count: { select: { questions: true, assignments: true, games: true } },
        games: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.questionSet.count({ where }),
  ]);

  return NextResponse.json({
    questionSets,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
