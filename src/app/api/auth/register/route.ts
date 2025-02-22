import { connectToDatabase } from "@/src/backend/lib/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/src/backend/models/User";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email) {
    return NextResponse.json(
      {
        error: "Email is required",
      },
      {
        status: 400,
      }
    );
  }

  if (!password) {
    return NextResponse.json(
      {
        error: "Password is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email is already registered",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.create({ email, password });

    return NextResponse.json(
      {
        message: "User registered successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: `Failed to register user - ${error}`,
      },
      {
        status: 500,
      }
    );
  }
}
