// app/api/appiontment/[id]/route.ts
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Appiontment from "@/model/Appiontment"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "User") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 })
    }

    await dbConnect()

    const appointment = await Appiontment.findOne({ 
      _id: params.id,
      userId: session.user.id 
    })

    if (!appointment) {
      return NextResponse.json({ message: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json({ appointment }, { status: 200 })

  } catch (error) {
    console.error("Appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}