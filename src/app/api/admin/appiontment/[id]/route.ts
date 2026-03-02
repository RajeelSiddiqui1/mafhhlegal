import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Appiontment from "@/model/Appiontment"
import User from "@/model/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { sendAppointmentStatusUpdateEmail } from "@/lib/email"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "Admin") {
      return NextResponse.json(
        { message: "Access denied" },
        { status: 403 }
      )
    }

    await dbConnect()

    const body = await req.json()
    const { status } = body

    if (!status || !["Pending", "Progress", "Rejected", "Completed"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      )
    }

    const appointment = await Appiontment.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )

    if (!appointment) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      )
    }

    // Get user details for email notification
    const user = await User.findById(appointment.userId).lean();
    
    if (user) {
      const userName = `${user.firstName} ${user.lastName}`;
      
      // Send email to the user who created the appointment
      await sendAppointmentStatusUpdateEmail(
        appointment.email,
        userName,
        status,
        {
          firstName: appointment.firstName,
          lastName: appointment.lastName,
          description: appointment.description,
          preferredDate: appointment.preferredDate,
          preferredTime: appointment.preferredTime,
          area: appointment.area
        }
      );
    }

    return NextResponse.json(
      { message: "Status updated successfully", appointment },
      { status: 200 }
    )

  } catch (error) {
    console.error("Status update error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}