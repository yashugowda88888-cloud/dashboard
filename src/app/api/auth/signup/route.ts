import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // First user is automatically admin and approved
        const userCount = await db.query.users.findMany();
        const role = userCount.length === 0 ? "admin" : "user";
        const isApproved = userCount.length === 0;

        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
            role,
            isApproved,
        });

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
