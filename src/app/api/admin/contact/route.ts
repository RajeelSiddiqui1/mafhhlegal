import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Contact from "@/model/Contact"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export  async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 })
    }

    await dbConnect()

    const contacts = await Contact.find().populate("userId", "firstName lastName email").sort({createdAt:-1})


    return NextResponse.json({
      contacts
    }, {
      status: 200
    })

  } catch (error) {
    console.error("Contact error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}