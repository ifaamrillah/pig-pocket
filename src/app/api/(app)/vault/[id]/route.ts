import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkFields, checkSession } from "@/lib/utils";
import { VaultValidator } from "@/lib/validator";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check session
  const user = await checkSession();
  if (user instanceof NextResponse) return user;

  // Params
  const id = (await params).id;

  // Get vault by id
  const getVaultbyId = await prisma.vault.findUnique({
    where: {
      id,
    },
  });
  if (!getVaultbyId) {
    return NextResponse.json(
      { message: `Vault with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      message: `Get vault with id: "${id}" successfully.`,
      data: getVaultbyId,
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
  const getVaultById = await prisma.vault.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getVaultById) {
    return NextResponse.json(
      { message: `Vault with id: "${id}" was not found.` },
      { status: 404 }
    );
  }

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
    },
    select: {
      id: true,
      name: true,
    },
  });
  if (existingVaultName && existingVaultName?.id !== id) {
    return NextResponse.json(
      { message: `Vault with name: "${body.name}" already exists.` },
      { status: 409 }
    );
  }

  // Update vault by id
  const updateVaultById = await prisma.vault.update({
    where: {
      id,
    },
    data: body,
  });
  if (updateVaultById) {
    return NextResponse.json(
      {
        message: "Edit vault successfully.",
        data: updateVaultById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json({ message: "Edit vault failed." }, { status: 500 });
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
  const getVaultById = await prisma.vault.findUnique({
    where: { id },
    select: {
      id: true,
    },
  });
  if (!getVaultById) {
    return NextResponse.json(
      {
        message: `Vault with id: "${id}" was not found.`,
      },
      { status: 404 }
    );
  }

  // Delate vault by id
  const deleteVaultById = await prisma.vault.delete({
    where: {
      id,
    },
  });
  if (deleteVaultById) {
    return NextResponse.json(
      {
        message: "Delete vault successfully.",
        data: deleteVaultById,
      },
      { status: 200 }
    );
  }

  // Internal server error
  return NextResponse.json(
    {
      message: "Edit vault failed.",
    },
    { status: 500 }
  );
}
