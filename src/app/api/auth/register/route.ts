import dbConnect from "@/lib/db"
import User from "@/model/User"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"


export async function POST(req: Request) {

    try {

        await dbConnect()

        const body = await req.json()

        const { firstName, lastName, email, password,role } = body


        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            )
        }


        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already registered" },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role === "Admin" ? "Admin" : "User"
        })

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        )

    } catch (error) {

        console.error("Register error:", error)

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}