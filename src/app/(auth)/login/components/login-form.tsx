"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { LoginValidator, TypeLoginValidator } from "@/lib/validator";

import { login } from "@/services/auth-service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/form-input";

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm<TypeLoginValidator>({
    resolver: zodResolver(LoginValidator),
    values: {
      email: "",
      password: "",
    },
  });

  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: (values: TypeLoginValidator) => login(values),
    onSuccess: () => {
      toast.success("Login user successfully.");
      router.push("/");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err?.response?.data?.message || "Login user failed.");
    },
  });

  const onSubmit = (values: TypeLoginValidator) => mutateLogin(values);

  return (
    <Card className="mx-auto w-[350px] md:w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
        <CardDescription>
          Manage your finances with ease and stay on top of your goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              disabled={isPendingLogin}
              onClick={() => signIn("github", { redirectTo: "/" })}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button
              variant="outline"
              disabled={isPendingLogin}
              onClick={() => signIn("google", { redirectTo: "/" })}
            >
              <FcGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                form={form}
                name="email"
                label="Email"
                placeholder="johndoe@mail.com"
                required
                disabled={isPendingLogin}
              />
              <FormInput
                form={form}
                name="password"
                label="Password"
                type="password"
                placeholder="********"
                required
                disabled={isPendingLogin}
              />
              <div className="text-sm text-end">
                <Link
                  href="/forgot-password"
                  className="underline text-muted-foreground"
                >
                  Forgot password?
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
      <CardFooter>
        <div className="space-y-4 w-full">
          <Button
            className="w-full"
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isPendingLogin}
          >
            {isPendingLogin ? "Loading..." : "Login"}
          </Button>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
