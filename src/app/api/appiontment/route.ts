import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import Appiontment from "@/model/Appiontment"
import User from "@/model/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { sendAppointmentCreatedEmail, sendNewAppointmentNotificationToAdmins } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "User") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 })
    }

    await dbConnect()
    const body = await req.json()
    const { firstName, lastName, email, description, phone, area, preferredDate, preferredTime } = body

    // Get user data from session if not provided in form
    let userFirstName = firstName;
    let userLastName = lastName;
    let userEmail = email;
    let sessionUser: any;
    
    sessionUser = await User.findById(session.user.id).lean();
    
    // If firstName/lastName/email not provided in form, use from session
    if (!userFirstName && sessionUser) userFirstName = sessionUser.firstName;
    if (!userLastName && sessionUser) userLastName = sessionUser.lastName;
    if (!userEmail && sessionUser) userEmail = sessionUser.email;

    if (!userFirstName || !userLastName || !userEmail || !description || !phone || !area || !preferredDate || !preferredTime) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

const dateTimeString = `${preferredDate} ${preferredTime}`;
const preferredDateTime = new Date(dateTimeString);
if (isNaN(preferredDateTime.getTime())) {
  return NextResponse.json({ message: "Invalid date/time" }, { status: 400 });
}

const appointment = await Appiontment.create({
  firstName: userFirstName,
  lastName: userLastName,
  email: userEmail,
  description,
  phone,
  area,
  preferredDate: preferredDateTime,
  preferredTime: preferredDateTime,
  userId: session.user.id,
  status: "Pending"
});

// Get user details for email
sessionUser = await User.findById(session.user.id).lean();
const userName = sessionUser ? `${sessionUser.firstName} ${sessionUser.lastName}` : `${userFirstName} ${userLastName}`;

// Get all admin emails
const admins = await User.find({ role: "Admin" }).select("email").lean();
const adminEmails = admins.map((admin) => admin.email);

// Send email to user who created the appointment
await sendAppointmentCreatedEmail(
  userEmail,
  userName,
  {
    firstName: userFirstName,
    lastName: userLastName,
    description,
    preferredDate,
    preferredTime,
    area
  }
);

// Send email to all admins
if (adminEmails.length > 0) {
  await sendNewAppointmentNotificationToAdmins(
    adminEmails,
    {
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
      phone,
      description,
      preferredDate,
      preferredTime,
      area,
      createdAt: new Date().toISOString()
    }
  );
}

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