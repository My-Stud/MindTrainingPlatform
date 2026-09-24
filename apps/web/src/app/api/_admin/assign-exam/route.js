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

    const formData = await req.formData()
    const questionSetId = formData.get("questionSetId")
    const targetType = formData.get("targetType") // "user" or "class"
    const targetId = formData.get("targetId") // email or class name
    const scheduledFor = formData.get("scheduledFor") // datetime string

    if (!questionSetId || !targetType || !targetId || !scheduledFor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const scheduledDate = new Date(scheduledFor)

    // Fetch the set name for the notification message
    const qSet = await prisma.questionSet.findUnique({ where: { id: questionSetId } })
    if (!qSet) throw new Error("Question set not found")

    const timeString = scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const notificationMessage = `go to the 'Mind Gym/Country Shooter' game there '${qSet.name}' game is waiting for you.`

    if (targetType === "user") {
      // Assign to specific user by email
      const user = await prisma.user.findUnique({ where: { email: targetId } })
      if (!user) {
        // Fallback to searching by exact name if email not found
        const userByName = await prisma.user.findFirst({ where: { name: targetId } })
        if (!userByName) throw new Error(`User '${targetId}' not found. Check the exact spelling.`)
        
        await prisma.assignedExam.create({
          data: {
            userId: userByName.id,
            questionSetId,
            scheduledFor: scheduledDate
          }
        })
        await prisma.notification.create({
          data: { userId: userByName.id, message: notificationMessage }
        })
      } else {
        await prisma.assignedExam.create({
          data: {
            userId: user.id,
            questionSetId,
            scheduledFor: scheduledDate
          }
        })
        await prisma.notification.create({
          data: { userId: user.id, message: notificationMessage }
        })
      }
    } else {
      // Assign to a whole class
      const classUsers = await prisma.user.findMany({ where: { studentClass: targetId } })
      
      // Still create a single AssignedExam record mapped to the class for admin tracking
      await prisma.assignedExam.create({
        data: {
          targetClass: targetId,
          questionSetId,
          scheduledFor: scheduledDate
        }
      })

      // Generate notifications for everyone in the class
      if (classUsers.length > 0) {
        await prisma.notification.createMany({
          data: classUsers.map(u => ({
            userId: u.id,
            message: notificationMessage
          }))
        })
      }
    }

    return NextResponse.json({ message: "Successfully assigned exam" }, { status: 200 })
  } catch (error) {
    console.error("Assign error:", error)
    return NextResponse.json({ error: error.message || "Failed to assign exam" }, { status: 500 })
  }
}
