import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Appiontment from "@/model/Appiontment"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "User") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 })
    }

    await dbConnect()
    const body = await req.json()
    const { firstName, lastName, email, description, phone, area, preferredDate, preferredTime } = body

    if (!firstName || !lastName || !email || !description || !phone || !area || !preferredDate || !preferredTime) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

const dateTimeString = `${preferredDate} ${preferredTime}`;
const preferredDateTime = new Date(dateTimeString);
if (isNaN(preferredDateTime.getTime())) {
  return NextResponse.json({ message: "Invalid date/time" }, { status: 400 });
}

await Appiontment.create({
  firstName,
  lastName,
  email,
  description,
  phone,
  area,
  preferredDate: preferredDateTime,
  preferredTime: preferredDateTime,
  userId: session.user.id,
  status: "Pending"
});

    return NextResponse.json({ message: "Appointment created successfully.... Please wait for Response" }, { status: 201 })

  } catch (error) {
    console.error("Appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export  async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "User") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 })
    }

    await dbConnect()

    const appiontments = await Appiontment.find({ userId: session.user.id }).sort({createdAt:-1})


    return NextResponse.json({
      appiontments
    }, {
      status: 200
    })

  } catch (error) {
    console.error("Appointment error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}