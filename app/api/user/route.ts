import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'; 

const client = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await client.user.findUnique({
      where: { id: decoded.userId },
    });

    if (user) {
      return NextResponse.json({ user: { username: user.username },token });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  const existingUser = await client.user.findUnique({
    where: { username },
  });
  let user;
  if (existingUser) {
    if (existingUser.password !== password) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
    user = existingUser;
  } else {
    user = await client.user.create({
      data: {
        username,
        password,
      },
    });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return NextResponse.json({
    message: "Success",
    username: user.username,
    token},
    {status:200}
  );
}
