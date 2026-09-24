import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth"
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5
    })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    
    // Build the query to include both direct assignments and class assignments
    const examWhereClause = {
      OR: [
        { userId: userId }
      ]
    }
    
    if (user?.studentClass) {
      examWhereClause.OR.push({ targetClass: user.studentClass })
    }

    const assignedExams = await prisma.assignedExam.findMany({
      where: examWhereClause,
      include: { 
        questionSet: {
          include: {
            questions: true
          }
        } 
      },
      orderBy: { scheduledFor: "asc" },
      take: 3
    })

    return NextResponse.json({ notifications, assignedExams })
  } catch (error) {
    console.error("Dashboard data error:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
