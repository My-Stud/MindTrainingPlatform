import { NextResponse } from "next/server"
import { PrismaClient } from "@/generated/prisma"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      if (!existingUser.password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { password: hashedPassword, name, role: "ADMIN" }
        })
        return NextResponse.json({
          user: { id: updatedUser.id, email: updatedUser.email },
          message: "Password added and upgraded to ADMIN"
        }, { status: 201 })
      }
      
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      )
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
        studentClass: "Admin"
      }
    })

    return NextResponse.json(
      { 
        user: { id: user.id, email: user.email },
        message: "Admin account created successfully" 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Admin Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    )
  }
}
