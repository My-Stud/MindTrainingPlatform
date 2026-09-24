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
  const role = searchParams.get("role") || "";
  const studentClass = searchParams.get("class") || "";

  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  if (role) where.role = role;
  if (studentClass) where.studentClass = studentClass;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        studentClass: true,
        role: true,
        createdAt: true,
        _count: { select: { scores: true, assignedExams: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
