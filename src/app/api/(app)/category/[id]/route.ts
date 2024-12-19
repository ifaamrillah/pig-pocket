import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkFields, checkSession } from "@/lib/utils";
import { CategoryValidator } from "@/lib/validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check session
  const user = await checkSession();
  if (user instanceof NextResponse) return user;

  // Params
  const id = (await params).id;

  // Get category by id
  const getCategoryById = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!getCategoryById) {
    return NextResponse.json(
      { message: `Category with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get category with id: "${id}" successfully.`,
      data: getCategoryById,
    },
    { status: 200 }
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check session
  const user = await checkSession();
  if (user instanceof NextResponse) return user;

  // Params
  const id = (await params).id;

  // Check id is valid
  const getCategoryById = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getCategoryById) {
    return NextResponse.json(
      { message: `Category with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

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
    select: {
      id: true,
      name: true,
    },
  });
  if (existingCategoryName && existingCategoryName?.id !== id) {
    return NextResponse.json(
      { message: `Category with name: "${body.name}" already exists.` },
      { status: 409 }
    );
  }

  // Update category by id
  const updateCategoryById = await prisma.category.update({
    where: {
      id,
    },
    data: body,
  });
  if (updateCategoryById) {
    return NextResponse.json(
      {
        message: "Edit category successfully.",
        data: updateCategoryById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Edit category failed." },
    { status: 500 }
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check session
  const user = await checkSession();
  if (user instanceof NextResponse) return user;

  // Params
  const id = (await params).id;

  // Check id is valid
  const getCategoryById = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getCategoryById) {
    return NextResponse.json(
      {
        message: `Category with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
  }

  // Delate category by id
  const deleteCategoryById = await prisma.category.delete({
    where: {
      id,
    },
  });
  if (deleteCategoryById) {
    return NextResponse.json(
      {
        message: "Delete category successfully.",
        data: deleteCategoryById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    {
      message: "Edit category failed.",
    },
    { status: 500 }
  );
}
