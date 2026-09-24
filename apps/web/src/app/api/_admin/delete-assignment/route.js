import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await prisma.assignedExam.delete({
      where: { id }
    })

    return NextResponse.redirect(new URL("/admin/assignments", req.url))
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Failed to delete assignment" }, { status: 500 })
  }
}
