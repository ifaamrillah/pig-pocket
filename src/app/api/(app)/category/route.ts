import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkFields, checkSession } from "@/lib/utils";
import { CategoryValidator } from "@/lib/validator";

export async function POST(req: NextRequest) {
  // Session
  const user = await checkSession();
  if (user instanceof NextResponse) return user;

  // Body
  const body = await checkFields(req, CategoryValidator);
  if (body instanceof NextResponse) return body;

  // Check name is unique
  const existingCategoryName = await prisma.category.findUnique({
    where: {
      userId_name: {
        userId: user.id as string,
        name: body.name,
      },
    },
  });
  if (existingCategoryName) {
    return NextResponse.json(
      { message: `Category with name "${body.name}" already exists.` },
      { status: 409 }
    );
  }

  const transformFields = () => {
    const { type, ...newData } = body;

    return {
      ...newData,
      type: type.value,
      userId: user.id as string,
    };
  };

  // Create category
  const createCategory = await prisma.category.create({
    data: transformFields(),
  });
  if (createCategory) {
    return NextResponse.json(
      {
        message: "Create category successfully.",
        data: createCategory,
      },
      { status: 201 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Create category failed." },
    { status: 500 }
  );
}
