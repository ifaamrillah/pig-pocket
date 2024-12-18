import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkFields, checkSession, parseQueryParams } from "@/lib/utils";
import { CategoryValidator } from "@/lib/validator";

export async function GET(req: NextRequest) {
  // Session
  const user = await checkSession();
  if (user instanceof NextResponse) return user;

  // Query params
  const { pagination, sorting, filters } = parseQueryParams(
    req.nextUrl.searchParams
  );
  const filterName = filters?.name || undefined;

  // Filter
  const where = {
    userId: user.id,
    ...(filterName && {
      name: { contains: filterName, mode: "insensitive" },
    }),
  };

  // Get all category
  const [getAllCategory, totalData] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (pagination.pageIndex - 1) * pagination.pageSize,
      take: pagination.pageSize,
      orderBy: sorting.orderBy,
    }),
    prisma.category.count({ where }),
  ]);

  return NextResponse.json({
    message: getAllCategory.length
      ? "Get all category successfully."
      : "No categories found.",
    data: getAllCategory,
    filters,
    pagination: {
      ...pagination,
      totalData,
      totalPage: Math.ceil(totalData / pagination.pageSize),
    },
    sorting,
  });
}

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
