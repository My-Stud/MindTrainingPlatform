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

    // Don't allow toggling your own role if you're the only admin
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN"

    await prisma.user.update({
      where: { id },
      data: { role: newRole }
    })

    return NextResponse.redirect(new URL("/admin/users", req.url))
  } catch (error) {
    console.error("Role error:", error)
    return NextResponse.json({ error: "Failed to toggle role" }, { status: 500 })
  }
}
