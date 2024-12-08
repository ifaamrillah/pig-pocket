"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

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
import { RegisterValidator, TypeRegisterValidator } from "@/lib/validator";

export const RegisterForm = () => {
  const form = useForm<TypeRegisterValidator>({
    resolver: zodResolver(RegisterValidator),
    values: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: TypeRegisterValidator) => {
    console.log(data);
  };

  return (
    <Card className="mx-auto w-[350px] md:w-[400px]">
      <CardHeader>
        <CardTitle className="text-2xl">Create Account!</CardTitle>
        <CardDescription>
          Start your journey to financial freedom.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline">
              <FaGithub className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline">
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
                name="name"
                label="Name"
                placeholder="John Doe"
                required
              />
              <FormInput
                form={form}
                name="email"
                label="Email"
                placeholder="johndoe@mail.com"
                required
              />
              <FormInput
                form={form}
                name="password"
                label="Password"
                type="password"
                placeholder="********"
                required
              />
              <div className="text-xs text-muted-foreground">
                Clicking the register button means you agree to our Terms of
                Service & Privacy Policy.
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
          >
            Register
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
