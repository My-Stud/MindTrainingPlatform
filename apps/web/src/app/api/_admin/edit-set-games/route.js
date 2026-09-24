import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { questionSetId, gameIds } = body

    if (!questionSetId) {
      return NextResponse.json({ error: "Question Set ID is required" }, { status: 400 })
    }

    // Update the question set games
    await prisma.questionSet.update({
      where: { id: questionSetId },
      data: {
        games: {
          set: [], // Clear existing relations
        }
      }
    })

    if (gameIds && gameIds.length > 0) {
      await prisma.questionSet.update({
        where: { id: questionSetId },
        data: {
          games: {
            connect: gameIds.map(id => ({ id }))
          }
        }
      })
    }

    return NextResponse.json({ message: "Success" }, { status: 200 })
  } catch (error) {
    console.error("Edit games error:", error)
    return NextResponse.json({ error: "Failed to update assigned games" }, { status: 500 })
  }
}
