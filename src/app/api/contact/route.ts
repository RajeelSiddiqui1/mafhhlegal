import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import User from "@/model/User";
import Contact from "@/model/Contact";

import {
  sendContactCreatedEmail,
  sendNewContactNotificationToAdmins
} from "@/lib/email";


export async function POST(req: Request) {
  try {

    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "User") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 });
    }

    await dbConnect();

    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      Inquiry
    } = body;


    let userFirstName = firstName;
    let userLastName = lastName;
    let userEmail = email;

    let sessionUser: any = await User.findById(session.user.id).lean();


    if (!userFirstName && sessionUser) userFirstName = sessionUser.firstName;
    if (!userLastName && sessionUser) userLastName = sessionUser.lastName;
    if (!userEmail && sessionUser) userEmail = sessionUser.email;


    if (
      !userFirstName ||
      !userLastName ||
      !userEmail ||
      !phone ||
      !subject ||
      !Inquiry
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }


    await Contact.create({
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
      phone,
      subject,
      Inquiry,
      userId: session.user.id,
      status: "Pending"
    });


    sessionUser = await User.findById(session.user.id).lean();

    const userName = sessionUser
      ? `${sessionUser.firstName} ${sessionUser.lastName}`
      : `${userFirstName} ${userLastName}`;


    const admins = await User.find({ role: "Admin" })
      .select("email")
      .lean();

    const adminEmails = admins.map((a) => a.email);


  await sendContactCreatedEmail(
  userEmail,
  userName,
  {
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    phone,
    subject,
    Inquiry
  }
);


    
    if (adminEmails.length > 0) {
     await sendNewContactNotificationToAdmins(
  adminEmails,
  {
    firstName: userFirstName,
    lastName: userLastName,
    email: userEmail,
    phone,
    subject,
    Inquiry,
    createdAt: new Date().toISOString()
  }
);
    }


    return NextResponse.json(
      { message: "Contact send successfully.... Please wait for Response" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}



export async function GET() {
  try {

    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "User") {
      return NextResponse.json({ message: "Access denied" }, { status: 400 });
    }

    await dbConnect();

    const contacts = await Contact
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { contacts },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}