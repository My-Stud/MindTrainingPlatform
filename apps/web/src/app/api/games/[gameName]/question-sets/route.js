import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function GET(req, { params }) {
  try {
    const { gameName } = params

    const game = await prisma.game.findUnique({
      where: { name: decodeURIComponent(gameName) },
      include: {
        questionSets: {
          include: {
            questions: true
          }
        }
      }
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json({ questionSets: game.questionSets }, { status: 200 })
  } catch (error) {
    console.error("Game question sets error:", error)
    return NextResponse.json({ error: "Failed to fetch question sets" }, { status: 500 })
  }
}
