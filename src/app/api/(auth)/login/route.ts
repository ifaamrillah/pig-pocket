import { NextRequest, NextResponse } from "next/server";
import { compareSync } from "bcrypt-ts";

import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { checkFields } from "@/lib/utils";
import { LoginValidator } from "@/lib/validator";

export async function POST(req: NextRequest) {
  // Body
  const body = await checkFields(req, LoginValidator);
  if (body instanceof NextResponse) return body;

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!existingUser || !existingUser.password) {
    return NextResponse.json(
      { message: `User with email "${body.email}" not exists.` },
      { status: 404 }
    );
  }

  // Verify password
  const passwordMatch = compareSync(body.password, existingUser.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 }
    );
  }

  await signIn("credentials", {
    email: body.email,
    redirect: false,
  });

  return NextResponse.json(
    {
      message: "Login user successfully.",
      data: body,
    },
    { status: 200 }
  );
}
