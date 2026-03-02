import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import User from "@/model/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export  async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 })
    }

    await dbConnect()

    const users = await User.find({role:{$ne:"Admin"}})


    return NextResponse.json({
      users
    }, {
      status: 200
    })

  } catch (error) {
    console.error("User error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}