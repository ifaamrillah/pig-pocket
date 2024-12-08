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
