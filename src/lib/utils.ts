import { NextRequest, NextResponse } from "next/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodType } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function validateFields<T>(
  req: NextRequest,
  validator: ZodType<T>
) {
  const body = await req.json();

  const validated = validator.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      {
        message: validated.error.errors[0]?.message || "Field validation error",
      },
      { status: 400 }
    );
  }

  return validated.data;
}

export function generateFallbackName(name: string) {
  if (!name || name.trim() === "") return "US";

  const words = name.trim().split(/\s+/);

  if (words.length > 1) {
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  } else {
    return name.slice(0, 2).toUpperCase();
  }
}
