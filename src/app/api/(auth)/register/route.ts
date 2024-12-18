import { NextRequest, NextResponse } from "next/server";
import { hashSync } from "bcrypt-ts";

import { prisma } from "@/lib/prisma";
import { checkFields } from "@/lib/utils";
import { RegisterValidator } from "@/lib/validator";
import { FREE_PLAN_DURATION } from "@/lib/constants";

export async function POST(req: NextRequest) {
  // Body
  const body = await checkFields(req, RegisterValidator);
  if (body instanceof NextResponse) return body;

  // Check email is unique
  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (existingUser) {
    return NextResponse.json(
      { message: `User with email "${body.email}" already exists.` },
      { status: 409 }
    );
  }

  const hashedPassword = hashSync(body.password, 10);
  const expiredPlan = new Date(Date.now() + FREE_PLAN_DURATION);

  // Create user
  const register = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      expiredPlan,
    },
  });
  if (register) {
    return NextResponse.json(
      {
        message: "Register user successfully.",
        data: register,
      },
      { status: 201 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Register user failed." },
    { status: 500 }
  );
}
