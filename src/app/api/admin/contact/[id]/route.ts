import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/db"
import User from "@/model/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { sendContactStatusUpdateEmail } from "@/lib/email"
import Contact from "@/model/Contact"

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

    const contact = await Contact.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    )

    if (!contact) {
      return NextResponse.json(
        { message: "Contact not found" },
        { status: 404 }
      )
    }

    
    const user = await User.findById(contact.userId).lean();
    
    if (user) {
      const userName = `${user.firstName} ${user.lastName}`;
      

    await sendContactStatusUpdateEmail(
  contact.email,
  userName,
  status,
  {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    subject: contact.subject,
    Inquiry: contact.Inquiry
  }
);
    }

    return NextResponse.json(
      { message: "Status updated successfully", contact },
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