import { NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/users-server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

// GET - List all users (protected route)
export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await getAllUsers();
  // Don't return passwords
  const safeUsers = users.map(({ password, ...user }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void password;
    return user;
  });
  
  return NextResponse.json(safeUsers);
}

// POST - Create a new user (protected route)
export async function POST(request: Request) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, name" },
        { status: 400 }
      );
    }

    const newUser = await createUser({ email, password, name });
    // Don't return password
    const { password: _pwd, ...safeUser } = newUser;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    void _pwd;

    return NextResponse.json(safeUser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

