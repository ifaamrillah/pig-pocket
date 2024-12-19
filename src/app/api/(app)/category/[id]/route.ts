import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkSession } from "@/lib/utils";

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
