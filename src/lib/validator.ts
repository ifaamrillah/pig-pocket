import { CategoryType, StatusType, VaultType } from "@prisma/client";
import { z } from "zod";

export const RegisterValidator = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      message: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(32, {
      message: "Password must be less than 32 characters",
    }),
});

export type TypeRegisterValidator = z.infer<typeof RegisterValidator>;

export const LoginValidator = z.object({
  email: z
    .string({
      message: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      message: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .max(32, {
      message: "Password must be less than 32 characters",
    }),
});

export type TypeLoginValidator = z.infer<typeof LoginValidator>;

export const VaultValidator = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  startingBalance: z
    .number({ message: "Starting Balance must be a number" })
    .min(0, { message: "Starting Balance must not be minus" }),
  type: z.nativeEnum(VaultType).default(VaultType.TRANSACTION),
  status: z.nativeEnum(StatusType).default(StatusType.ACTIVE),
});

export type TypeVaultValidator = z.infer<typeof VaultValidator>;

export const CategoryValidator = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  type: z.nativeEnum(CategoryType).default(CategoryType.EXPENSE),
  status: z.nativeEnum(StatusType).default(StatusType.ACTIVE),
});

export type TypeCategoryValidator = z.infer<typeof CategoryValidator>;
