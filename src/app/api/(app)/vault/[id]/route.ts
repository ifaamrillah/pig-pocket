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
