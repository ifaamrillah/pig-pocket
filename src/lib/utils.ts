import { NextRequest, NextResponse } from "next/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodType } from "zod";

import { auth } from "@/lib/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkFields<T>(req: NextRequest, validator: ZodType<T>) {
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

export async function checkSession() {
  const session = await auth();
  if (!session?.expires || !session?.user) {
    return NextResponse.json(
      { message: "Unauthorized access." },
      { status: 401 }
    );
  }

  if (isExpired(session?.expires)) {
    return NextResponse.json(
      { message: "Session expired. Please log in again." },
      { status: 401 }
    );
  }

  return session?.user;
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

export function isExpired(expiration: string) {
  const expirationDate = new Date(expiration);
  return Date.now() > expirationDate.getTime();
}
