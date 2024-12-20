import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkFields, checkSession, parseQueryParams } from "@/lib/utils";
import { VaultValidator } from "@/lib/validator";

export async function GET(req: NextRequest) {
  // Check session
  const user = await checkSession();
  if (user instanceof NextResponse) return user;

  // Query params
  const { pagination, sorting, filters } = parseQueryParams(
    req.nextUrl.searchParams
  );
  const filterName = filters?.name || undefined;
  const filterStatus = filters?.status || undefined;

  // Filter
  const where = {
    userId: user.id,
    ...(filterName && {
      name: { contains: filterName, mode: "insensitive" },
    }),
    ...(filterStatus && { status: filterStatus }),
  };

  // Get all vault
  const [getAllVault, totalData] = await Promise.all([
    prisma.vault.findMany({
      where,
      skip: (pagination.pageIndex - 1) * pagination.pageSize,
      take: pagination.pageSize,
      orderBy: sorting.orderBy,
    }),
    prisma.vault.count({ where }),
  ]);

  return NextResponse.json({
    message: getAllVault.length
      ? "Get all vault successfully."
      : "No vaults found.",
    data: getAllVault,
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
  const body = await checkFields(req, VaultValidator);
  if (body instanceof NextResponse) return body;

  // Check name is unique
  const existingVaultName = await prisma.vault.findUnique({
    where: {
      userId_name: {
        userId: user.id as string,
        name: body.name,
      },
      type: body.type,
    },
  });
  if (existingVaultName) {
    return NextResponse.json(
      { message: `Vault with name "${body.name}" already exists.` },
      { status: 409 }
    );
  }

  // Create vault
  const createVault = await prisma.vault.create({
    data: {
      ...body,
      userId: user.id as string,
    },
  });
  if (createVault) {
    return NextResponse.json(
      {
        message: "Create vault successfully.",
        data: createVault,
      },
      { status: 201 }
    );
  }

  // Internal server error
  return NextResponse.json(
    { message: "Create vault failed." },
    { status: 500 }
  );
}
